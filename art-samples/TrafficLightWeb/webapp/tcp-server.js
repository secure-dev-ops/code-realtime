module.exports = function(host, port) {  
    const net = require('net');
    
    let module = {};  
    
    let loggingEnabled = false;
    // Log the message to the console if logging is enabled
    function log(msg) {
        if (loggingEnabled)
            console.log(msg);
    }

    let server = null; // TCP server for messages received from the RT application
    let eventReceivedCallback = function (msg) {
        log("Received: " + msg.event);
    }

    // Called if a message is received from the RT application
    function msgReceived(conn) {
        let remoteAddress = conn.remoteAddress + ':' + conn.remotePort;  
        log('message received from RT application running at %s', remoteAddress);

        conn.on('data', (d) => {            
            log('connection data from %s: %s', remoteAddress, d.toString());  
            let received;
            try {
                received = JSON.parse(d.toString());
            } 
            catch (e) {
                // Received something that was not parseable as JSON - skip it
                log('ERROR: Not parseable as JSON');
                conn.end();
                return;
            }

            eventReceivedCallback(received);            

            if (received.command == 'sendEvent') {                
                // For sendEvent we just need to ack the received message to let the RT application proceeed
                conn.write('{}'); 
                conn.end();
            }
        });  
        conn.once('close', () => {
            log('connection from %s closed', remoteAddress);
        });  
        conn.on('error', (err) => {
            log('Connection %s error: %s', remoteAddress, err.message);
        });
    }

    /**
     * Start listening for messages from the RT application by launching a TCP server 
     * on the specified port.
     * @param {number} receivePort Port to listen to
     */    
    module.startListenForEvents = function(receivePort) {
        return new Promise((resolve, reject) => {
            // Create a TCP server listening on receivePort to capture messages sent out from the RT application
            server = net.createServer();
            server.on('connection', msgReceived);
            
            server.listen(receivePort, '127.0.0.1', () => {
                resolve();
            });        
            server.on('error', (err) => {
                reject(err)
            });
        });
    }

    /**
     * Register a callback function to be called when an event is received
     * @param {function} cb Callback function 
     */
    module.setEventReceivedCallback = function(cb) {
        eventReceivedCallback = cb;
    }

    // Attempt to connect the socket
    function connect(socket) {
        return new Promise((resolve, reject) => {
            let socket = new net.Socket();
            socket.connect({ port: port, host: host });
            socket.on('connect', function() {        
                log('TCP connection established with the RT application at ' + host + ':' + port);    
                resolve(socket);
            });
            socket.on('error', function(err) {        
                log('TCP connection failed with the RT application at ' + host + ':' + port);    
                reject(err);
            });
        });            
    }

    /**
     * Send an event to the RT application. Returns a promise which will be resolved with
     * a status message (saying something like "OK") if the event was successfully sent,
     * or rejected with an Error object in case the event failed to be sent.
     * @param {string} rtEventName Name of event to send
     * @param {string} rtPort Name of port (on the test probe capsule) where to send the event
     * @param {string} [rtData] String encoding of the data to send with the event
     * @param {number} [rtPortIndex=0] Port index where to send the event
     */
    module.sendEvent = function(rtEventName, rtPort, rtData, rtPortIndex) {
        return new Promise((resolve, reject) => {            
            return connect()
            .then((socket) => {
                let json = '{ "event" : "' + rtEventName + '" , "command" : "sendEvent", "priority" : "General", "port" : "' + rtPort + '"';
                if (rtData) {
                    json += ', "data" : "' + rtData + '"';
                }
                if (rtPortIndex) {
                    json += ', "portIndex" : ' + rtPortIndex;
                }
                json += '}';
                socket.write(json);

                socket.on('data', (data) => {
                    // Check if the sending was successful or not
                    try {
                        let reply = JSON.parse(data);
                        if (reply.status == 'error') 
                            reject(new Error(reply.msg));
                        else
                            resolve(reply.msg);
                    }
                    catch (e) {
                        // Ignore JSON parse errors - could happen if extra data is read from the socket like a trailing newline
                    }
                    socket.end();                
                });
                socket.on('error', function(err) {        
                    console.log('Failed to send to server : ' + json);                
                    reject(err);
                });
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Enable or disable logging to the console. Logging is by default disabled.
     * @param {boolean} enabled 
     */
    module.enableLogging = function(enabled) {
        loggingEnabled = enabled;
    }

    return module;
}