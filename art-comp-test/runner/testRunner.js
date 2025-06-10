const { spawn } = require('child_process');
const logger = require('./logger');
const fs = require('fs');

const waitCommand = 'wait ';
const rtpLaunchScript = 'C:/WindRiver/rtpLaunch.sh';
const vxWorksTestLog = 'C:/WindRiver/testlog.txt';
const vxWorksSimulatorArgs = [
    '-s', '/host.host/' + rtpLaunchScript,
    '-l', vxWorksTestLog,
    '-f', 'C:/WindRiver/workspace/VIP/default/vxWorks',
    '-exitOnError'
];

module.exports = function(argv) {   
    let module = {};

	let fail = function(testCase, msg) {
		testCase.addToTestLog(msg + '\n', 'stderr');
		testCase.errorMsg = msg;
		logger.log(testCase.name + ' : FAIL : ' + msg);
	}

    async function runExecutable(testCase, onRunCompleted, nExe) {
		let testExeArgs = testCase.testExeArgs;
		let debugCommands = testCase.debugCommands;
		if (nExe == 2) {
			if (testCase.testExeArgs2.length == 0 && testCase.debugCommands2.length == 0) {
				onRunCompleted(false);
				return;
			}
			testExeArgs = testCase.testExeArgs2;
			debugCommands = testCase.debugCommands2;
		}
        let testExecutable = testCase.exeTarget + testCase.executable;
        logger.log(testCase.name + ' : Running  ' + testExecutable + ' ' + testExeArgs.join(' '));

        let childProcess;
        let msg;
        try {
			if (argv.targetConfig.startsWith('VxWorks')) {
				let sleepSecs = (testCase.timeout == argv.testTimeout) ? (/(Timing|timing|timer)/.test(testCase.name) ? 9 : 3) : testCase.timeout - 15;
				for (var i = 0; i < debugCommands.length; i++) {
					let command = debugCommands[i];
					if (command.startsWith(waitCommand)) {
						sleepSecs = command.substring(waitCommand.length);
						logger.log(testCase.name + ' : Debug commands converted to sleep : ' + debugCommands.join('; ') + ' --> ' + 'sleep ' + sleepSecs);
						testExeArgs.push('-URTS_DEBUG=quit');
						debugCommands = [];
						break;
					}
				}
				if (debugCommands.length > 0) {
					fail(testCase, 'Execution with debug commands is not (yet?) supported for VxWorks: ' + debugCommands.join('; '));
					onRunCompleted(false);
					return;
				}
				let rtpScriptCmd = 'rtpSp "/host.host/' + testExecutable + '.vxe' + ' ' + testExeArgs.join(' ') + '"\nsleep ' + sleepSecs + '\nreboot -h';
				fs.writeFileSync(rtpLaunchScript, rtpScriptCmd);
				childProcess = spawn('vxsim', vxWorksSimulatorArgs);
			}
			else {
				childProcess = spawn(testExecutable, testExeArgs);
			}
        }
        catch (err) {
            msg = 'Failed to launch test execution of: ' + testExecutable;
            testCase.addToTestLog(msg + '\n', 'stderr');
            testCase.addToTestLog(err + '\n', 'stderr');
			testCase.errorMsg = msg;
            logger.log(msg);
            logger.log(err);
            onRunCompleted(false);
            return;
        }

        childProcess.on('error', (err) => {
			msg = 'Error printout occurred in test execution of: ' + testExecutable;
            testCase.addToTestLog(msg + '\n', 'stderr');
            testCase.addToTestLog(err + '\n', 'stderr');
			testCase.errorMsg = msg;
            logger.log(msg);
            logger.log(err);
            clearTimeout(timer);
            onRunCompleted(false);
        });

		// Kill the child process if it doesn't terminate within the specified time limit
		let killedOK = false;
		let timer = setTimeout(() => {
			childProcess.kill('SIGINT');
			msg = 'Killed test application after ' + testCase.timeout + ' seconds';
			if (testCase.group == 'samples') {
				testCase.addToTestLog(msg + '\n', 'stderr');
				killedOK = true;
			} else {
				fail(testCase, 'Killed test application after ' + testCase.timeout + ' seconds');
				onRunCompleted(false);
			}
		}, testCase.timeout * 1000)

        let containsFail = false;
        let passed = false;
        childProcess.stdout.on('data', (data) => {
            // Look for the magic "PASS" message
            if (data.includes('***PASS***'))
                passed = true;
            testCase.addToTestLog(data, 'stdout');
            //console.log(`stdout: ${data}`);
        });

        childProcess.stderr.on('data', (data) => {
            if (!testCase.goldenStderr && data.includes('FAIL')) {
                containsFail = true;
            }
            testCase.addToTestLog(data, 'stderr');
            //console.log(`stderr: ${data}`);
        });
        
        childProcess.on('close', (code) => {
            // Run completed.
            clearTimeout(timer);

			if (argv.targetConfig.startsWith('VxWorks')) {
				try {
					let data = fs.readFileSync(vxWorksTestLog, 'utf8');
					fs.unlinkSync(vxWorksTestLog);
					data = data.substring(data.lastIndexOf('RT C++ Target Run Time System'), data.lastIndexOf('value = '));
					if (data.includes('***PASS***'))
						passed = true;
					else if (!testCase.goldenStderr && data.includes('FAIL'))
						containsFail = true;
					testCase.addToTestLog(data, 'stdout');
					data = data.split(/\r?\n/).filter(function(elem, i) {
						if (/\*\*\*PASS\*\*\*/.test(elem)) // Remove magic PASS printed to std::cout by TestUtils
							return false;
						if (/^OK:  /.test(elem)) // Comes from okMessage printed to std::cout by TestUtils
							return false;
						if (/\((FrontPanel|Sprayer|Warmer|CashBox)\) /.test(elem)) // Printed from rose_rt_CoffeeMachine with cout
							return false;
						return true;
					}).join('\n');
					testCase.addToTestLog(data, 'stderr');
				}
				catch(err) {
					fail(testCase, 'Failed to read test execution output from ' + vxWorksTestLog);
					testCase.addToTestLog(err + '\n', 'stderr');
					logger.log(err);
					onRunCompleted(false);
					return;
				}
			}

            if (containsFail) {
				fail(testCase, 'stderr contains FAIL');
                onRunCompleted(false);
                return;
            }

			let codeOK = (code == 0) || killedOK;
			if (!codeOK) {
				fail(testCase, 'Executable returned non-zero exit code : ' + code);
				onRunCompleted(false);
				return;
			}

            let logsOK = testCase.checkExeLogs();
            if (testCase.testExeExpectPASSstdout && nExe == 1 && !passed) {
                msg = 'FAIL : Magic ***PASS*** was not found in execution stdout';
                testCase.addToTestLog(logger.heading(msg), 'stdout');
				testCase.errorMsg = msg;
                logger.log(testCase.name + ' : ' + msg);
                onRunCompleted(false);
                return;
            }
            onRunCompleted(logsOK);
        });

        if (debugCommands.length > 0) {
            childProcess.stdin.on('error', (err) => {
                msg = 'Failed to send input to test executable: ' + testExecutable;
                testCase.addToTestLog(msg + '\n', 'stderr');
                testCase.addToTestLog(err + '\n', 'stderr');
				testCase.errorMsg = msg;
                logger.log(msg);
                logger.log(err);
                clearTimeout(timer);
                onRunCompleted(false);
            });
            childProcess.stdin.setEncoding('utf-8');
            for (var i = 0; i < debugCommands.length; i++) {
                let command = debugCommands[i];
                logger.log(testCase.name + ' : executable ' + command);
                if (command.startsWith('<')) {
                    childProcess.stdin.write(command.substring(1) + '\n');
                }
                else if (command.startsWith(waitCommand)) {
                    await new Promise(resolve => setTimeout(resolve, command.substring(waitCommand.length) * 1000));
                }
            }
        }
    }

    // Runs the testcase
    module.runTest = function(testCase, onRunCompleted) {
        testCase.setState('Running');
        runExecutable(testCase, onRunCompleted, 1);
		runExecutable(testCase, (verdict) => {}, 2);
    }

    return module;
}

