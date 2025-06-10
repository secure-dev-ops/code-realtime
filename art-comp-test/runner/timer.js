// Timer for measuring execution time of tests
module.exports = function() {   
    let module = {};    

    let startTime = null;
    let stopTime = null;    
    let timer;

    // Return an object describing hours, minutes and seconds corresponding to the input number of seconds
    function getTimeObj(sec) {
        let time = {seconds : sec};
        if (time.seconds >= 3600) {
            time.hours = Math.floor(time.seconds/3600);
            time.seconds = time.seconds % 3600;
        }
        if (time.seconds >= 60) {
            time.minutes = Math.floor(time.seconds/60);
            time.seconds = time.seconds % 60;
        }
        return time;
    }

    // Start the timer. To be called before starting the test execution.
    // The callback will be called each second while the timer is active
    // (can be used for showing progress of test execution).
    module.start = function(tickCallback) {
        startTime = new Date();
        stopTime = null;
        let seconds_since_start = 0;

        timer = setInterval(() => {
            seconds_since_start++;        
            tickCallback(getTimeObj(seconds_since_start));
        }, 1000);        
    }

    // Stop the timer. To be called when the test execution has finished.
    module.stop = function() {
        stopTime = new Date();
        clearInterval(timer);
    }

    // If the timer is started, returns the start time, otherwise null.
    module.getStarted = function() {
        return startTime;
    }

    // Returns the total number of seconds between starting and stopping the timer
    module.getTotalTimeSec = function() {
        if (!startTime || !stopTime)
            return {}; // Timer was not started and/or stopped

        return Math.floor((stopTime - startTime) / 1000);
    }

    // Return an object describing total time in hours, minutes and seconds between starting and stopping the timer
    module.getTotalTime = function() {
        if (!startTime || !stopTime)
            return {}; // Timer was not started and/or stopped

        return getTimeObj(Math.floor((stopTime - startTime) / 1000));
    }

    // As above but returns a printable string instead.
    module.getTotalTimeStr = function() {
        let time = this.getTotalTime();
        let timeStr = '';
        if (time.hasOwnProperty('hours'))
            timeStr += time.hours + ' hours ';
        if (time.hasOwnProperty('minutes'))
            timeStr += time.minutes + ' minutes ';
        if (time.hasOwnProperty('seconds'))
            timeStr += time.seconds + ' seconds';

        return timeStr;
    }
    
    return module;
}
