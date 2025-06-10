const sep1 = '----------------------------------------------';
const sep11 = '---------------- ';
const sep12 = ' ----------------';
const sep2 = '==============================================';

module.exports = {

    logSeparator : function(msg) {
		if (msg)
			console.log(sep11 + msg + sep12);
		else
			console.log(sep1);
    },
    
    logSeparator2 : function() {
        console.log(sep2);
    },

    heading : function(msg) {
        return '\n--------------------------\n' + msg + '\n--------------------------\n';
    },

    // Log a message to the test script log
    log : function(msg) {
        console.log(msg);
    }
    
}; 

