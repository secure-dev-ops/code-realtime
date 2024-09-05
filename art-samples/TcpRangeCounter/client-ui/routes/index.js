var express = require('express');
var router = express.Router();
const testProbe = require ('rt-test-probe')('localhost', 12345);
	
function sendEvent(data, fn) {
	
	console.log("Entered the sendEvent function");
	
	var eventType = data.eventType;
	var arg = data.arg;
	
	console.log("Event Type = " + eventType);
	console.log("Argument = " + arg);
		
	let success = false;

    if (eventType == 'resume') {    
    	testProbe.sendEvent('resumeCounting', 'counter');
    	arg = "n/a";
    	success = true;
    }
    else if (eventType =='max') {
    	testProbe.sendEvent('setMax', 'counter', 'int ' + arg);
    	success = true;
	} 
    else if (eventType == 'min') {
    	testProbe.sendEvent('setMin', 'counter', 'int ' + arg);
	    success = true;
	}
	else if (eventType == 'delta') {
        testProbe.sendEvent('setDelta', 'counter', 'int ' + arg);
        success = true;
   } 
      
    var eventJsonString = JSON.stringify({ eventType, arg });
    console.log('eventJsonString = ' + eventJsonString);
    return fn(null, eventJsonString);
}
	
router.get('/', function(req, res) {
  res.redirect('index');
});

router.get('/index', function(req, res) {
  res.render('index', { title: 'Request' });
});

router.post('/sendEvent', function(req, res) {
	console.log("JSON.stringify(req.body) = " + JSON.stringify(req.body));
	if (req.body != undefined) {		
		sendEvent(req.body, function(err, data) 
				{  res.render('status', { title: 'Range Counter Client', data: data }); });
	}	
});

module.exports = router; 