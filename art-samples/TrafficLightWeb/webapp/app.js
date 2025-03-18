/*******************************************************************************
 * (c) Copyright HCL Technologies Ltd. 2018.  MIT Licensed!
 *******************************************************************************/

/**
 * Server application entry point
 * @author Mattias Mohlin
 */
'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = 3004;
const env = process.env.NODE_ENV || 'development';


// Static middleware for serving static files 
app.get('/', function(req, res) {
    res.contentType("text/html");
    res.sendFile(__dirname + '/public/html/main.html');
});
app.get('/css', function(req, res) {
    res.contentType("text/css");
    res.sendFile(__dirname + '/public/css/styling.css');
});
app.get('/images/stop', function(req, res) {
    res.contentType("img/png");
    res.sendFile(__dirname + '/public/images/stop.png');
});
app.get('/images/walk', function(req, res) {
    res.contentType("img/png");
    res.sendFile(__dirname + '/public/images/walk.png');
});
app.get('/main', function(req, res) {
    res.contentType("text/javascript");
    res.sendFile(__dirname + '/public/js/main.js');
});
app.get('/jquery', function(req, res) {
    res.contentType("text/javascript");
    res.sendFile(__dirname + '/public/js/jquery/jquery.min.js');
});

// Called when a message is received from the RT application
function msgReceived(msg) {
    if (msg.port == "trafficLight") {
        // Message from traffic light

        if (msg.event == "red") {
            io.emit('light', {'light' : 'red'});
        }
        else if (msg.event == "yellow") {
            io.emit('light', {'light' : 'yellow'});
        }
        else if (msg.event == "green") {
            io.emit('light', {'light' : 'green'});
        }
    }
    else if (msg.port == "pedLightControl") {
        // Message from pedestrian light
        if (msg.event == "stop") {
            io.emit('pedlight', {'light' : 'stop'});
        }
        else if (msg.event == "walk") {
            io.emit('pedlight', {'light' : 'walk'});            
        }
        else if (msg.event == "timeRemaining") {
            io.emit('pedcount', {'count' : msg.data.split(" ")[1]}); // Strip off data type and only keep the value
        }
    }
}

const tcpServer = require('rt-tcp-utils')('localhost', 3003); // Send TCP requests to RT app on port 3003

tcpServer.setEventReceivedCallback(msgReceived);
tcpServer.startListenForEvents(3002) // Receive TCP requests from RT app on port 3002
.then((data) => {
    console.log("Ready to receive TCP requests");    
});

// Messages from web application to RT application 
app.get('/ped_button', function(req, res) {
    tcpServer.sendEvent('pedestrian', 'trafficLight');

    res.end();
});

http.listen(port, () => console.log(`Web app listening on port ${port}!`));
