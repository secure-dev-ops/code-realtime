const logger = require('./logger');

// Webserver for tracking test execution progress and for interactively running tests from a web UI
module.exports = function(argv) {   
    let module = {};    

    let io = null;

    // Start the web server and add routes for serving static files. 
    // Then the registerRoutes function is called to allow additional routes to be added in the caller context.
    module.start = function(registerRoutes) {
        let express = require('express');
        let app = express();
        let http = require('http').Server(app);
        io = require('socket.io')(http);
    
        // Static middleware for serving static files 
        app.get('/', function(req, res) {
            res.contentType("text/html");
            res.sendFile(__dirname + '/public/html/main.html');
        });
        app.get('/css', function(req, res) {
            res.contentType("text/css");
            res.sendFile(__dirname + '/public/css/styling.css');
        });
        app.get('/main', function(req, res) {
            res.contentType("text/javascript");
            res.sendFile(__dirname + '/public/js/main.js');
        });
        app.get('/jquery', function(req, res) {
            res.contentType("text/javascript");
            res.sendFile(__dirname + '/public/js/jquery/jquery.min.js');
        });

        // Register other routes in the caller context
        registerRoutes(app);
            
        http.listen(argv.port, () => {
            logger.logSeparator();
            logger.log(`Web server started! View test execution progress at http://${argv.hostname}:${argv.port}`)
            logger.logSeparator();
        });        
    }

    // Determines if the web server was started
    module.isStarted = function() {
        return io != null;
    }

    // Notify all clients currently connected to the web server
    module.notifyClients = function(msg, data) {
        if (this.isStarted())
            io.emit(msg, data);
    }

    return module;
}
