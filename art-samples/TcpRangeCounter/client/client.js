const testProbe = require ('rt-test-probe')('localhost', 12345);

let success = false;

if (process.argv.length == 3) {
    if (process.argv[2] == '-resume') {    
        testProbe.sendEvent('resumeCounting', 'counter');
        success = true;
    }
}
else if (process.argv.length == 4) {
    if (process.argv[2] == '-max') {
        let max = process.argv[3];
        testProbe.sendEvent('setMax', 'counter', 'int ' + max);
        success = true;
    }
    else if (process.argv[2] == '-min') {
        let min = process.argv[3];
        testProbe.sendEvent('setMin', 'counter', 'int ' + min);
        success = true;
    }
    else if (process.argv[2] == '-delta') {
        let delta = process.argv[3];
        testProbe.sendEvent('setDelta', 'counter', 'int ' + delta);
        success = true;
    }
}

if (!success) {
    console.log('Usage: node client.js <arg>');    
    console.log('where <arg> is one of:');
    console.log('   -max <int> : Set max of range');
    console.log('   -min <int> : Set min of range');
    console.log('   -delta <int> : Set delta (positive to count up, negative to count down)');
    console.log('   -resume : Resume counting');    
}

