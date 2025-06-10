/**
 * 
 * Represents a test case. If the web server is running, all changes to the testcase object
 * will be propagated to all clients currently connected to the web server.
 */

const fs = require('fs-extra');
const showdown = require('showdown');
const logger = require('./logger');

const defaultSteps = 'clean, generate-build, compare, execute';

module.exports = function(webServer) {

    let converter = new showdown.Converter( // Markdown to HTML converter
        {
            tables: true,
            metadata: true,
            ghCompatibleHeaderId: true,
            disableForced4SpacesIndentedSublists : true
        });
    showdown.setFlavor('github');

    let TestCase = function(argv, name, testCaseFile, projectsDir, topProject, withNestedFolders, registry) {
        this.projectsDir = projectsDir;
        this.topProject = topProject;
        this.topProjectPath = projectsDir + '/' + topProject;
        this.withNestedFolders = withNestedFolders;
        this.registry = registry;
        let matches = testCaseFile.match(/testcase(.+)\.md/);
        if (matches) {
            this.postfix = matches[1];
            this.outDir = this.projectsDir + '/' + this.postfix;
        } else {
            this.postfix = '';
            this.outDir = this.projectsDir;            
        }
        this.name = name + this.postfix;
        if (argv.artCompilerJar) {
            // For Art Compiler we want to generate into each test folder
            if (!this.withNestedFolders) {
                this.outDir += '/' + this.name;
            }
        }
		this.group = 'undefined';

        this.description = '<missing description>';
        this.isHTMLDescription = false;

        this.compilerJVMArgs = [];
        this.compilerCmdArgs = [];
        this.compilerOutput = {};
        this.compilerErrorExpected = false;
        this.env = [];
        this.isFullCommandLine = false;
        this.timeout = argv.testTimeout;
        this.executable = argv.modelCompilerJar ? '/default/executable' : '/default/Top';
        this.isBigTest = false;
        this.allow_stderr_printouts = argv.artCompilerJar && !argv.artIntegration ? false : true;
        this.testExeArgs = [];
        this.testExeArgs2 = [];
        this.testExeExpectPASSstdout = false;
        this.debugCommands = [];
        this.debugCommands2 = [];
        testCaseSteps = defaultSteps;
        this.compareInfo = [];
        let curCompareInfo;

        this.readTestDescription = function() {
            let filePath = this.topProjectPath + '/' + testCaseFile;
            if (filePath.endsWith('txt'))
                this.description = fs.readFileSync(filePath, 'utf8');
            else {
                this.description = converter.makeHtml(fs.readFileSync(filePath, 'utf8'));
                this.isHTMLDescription = true;
                var metadata = converter.getMetadata();
                for (var key in metadata) {
                    let value = metadata[key];
    
                    if (key == 'converted_from')
                        continue;
    
                    if (key == 'group') {
                        this.group = value;
                        continue;
                    }
    
                    // Check if execution must be skipped
                    if (key == 'platform') {
                        if (value.toLowerCase() == 'windows')
                            value = 'win';
                        if (!argv.targetConfig.toLowerCase().startsWith(value.toLowerCase())) {
                            this.skipExecution = 'only on ' + value;
                        }
                        continue;
                    }
                    if (key == 'compiler') {
                        let compilers = value.toLowerCase().split(/,\s*/);
                        let isGNU = (argv.targetConfig.indexOf('-MinGw-') != -1 || argv.targetConfig.indexOf('-gcc-') != -1);
                        let isGCC4 = (argv.targetConfig.indexOf('-gcc-4') != -1);
                        let isMSVS = (argv.targetConfig.indexOf('-VisualC++-') != -1);
                        let isClang = (argv.targetConfig.indexOf('-Clang-') != -1);

                        if (argv.oldCpp && compilers.some(cc => cc.startsWith('c++') && (cc != 'c++98'))) {
                            this.skipExecution = 'skip for oldCpp, only with C++ 11 or higher';
                            continue;
                        }
                        if (isGCC4 && compilers.some(cc => cc.startsWith('c++') && (cc != 'c++98') && (cc != 'c++11'))) {
                            this.skipExecution = 'gcc4 does not support C++ 14 and higher';
                            continue;
                        }
                        if (compilers.some(cc => cc.startsWith('gnu')) && !isGNU && !isClang) {
                            this.skipExecution = 'only with GNU or Clang compiler';
                            continue;
                        }
                        if (compilers.some(cc => cc.startsWith('visualstudio')) && !isMSVS) {
                            this.skipExecution = 'only with Visual Studio compiler';
                            continue;
                        }
                        if (compilers.some(cc => cc == '!clang') && isClang) {
                            this.skipExecution = 'not executed with Clang compiler';
                            continue;
                        }
                        compilers.forEach(cc => {
                            if (cc.startsWith('c++') || cc.startsWith('pre-c++'))
                                this.compilerCmdArgs.push('--codeStandard=' + cc);
                        });
                        continue;
                    }
                    if (key == 'product') {
                        if (value.toLowerCase() != argv.toolName)
                            this.skipExecution = 'only for ' + value;
                        continue;
                    }
                    if (key == 'version') {
                        if (value.toLowerCase() > argv.compilerVersion)
                            this.skipExecution = 'since version ' + value;
                        continue;
                    }
                    if (key == 'target_rts_version') {
                        if (value.toLowerCase() > argv.targetRTSVersion)
                            this.skipExecution = 'since TargetRTS version ' + value;
                        continue;
                    }
    
                    // Additional test case execution parameters
                    if (key == 'steps') {
                        testCaseSteps = value;
                        logger.log(this.name + ' : steps = ' + value);
                        continue;
                    }
                    if (key == 'env') {
                        this.env.push(...value.split(/\s+/));
                        logger.log(this.name + ' : env : ' + value);
                        continue;
                    }
                    if (key == 'mc_jvm_args' || key == 'ac_jvm_args') {
                        for (var arg of value.split(/\s+/))
                            this.compilerJVMArgs.push(arg.replace(/_dollar_/g, '$').replace(/_space_/g, ' '));
                        //this.compilerJVMArgs.push(...value.split(/\s+/));
                        logger.log(this.name + ' : ' + key + ' = ' + this.compilerJVMArgs);
                        continue;
                    }
                    if (key == 'mc_cmd_args' || key == 'ac_cmd_args') {
                        for (var arg of value.split(/\s+/))
                            this.compilerCmdArgs.push(arg.replace(/_dollar_/g, '$'));
                        //this.compilerCmdArgs.push(...value.split(/\s+/));
                        logger.log(this.name + ' : ' + key + ' = ' + value);
                        continue;
                    }
                    if (key == 'mc_cmd_full' || key == 'ac_cmd_full') {
                        this.isFullCommandLine = true;
                        logger.log(this.name + ' : ' + key + ' = yes');
                        if (argv.oldCpp)
                            this.skipExecution = 'skip for oldCpp, command line is full and can not be updated';
                        continue;
                    }
                    if (key.startsWith('mc_output') || key.startsWith('ac_output')) {
                        let checkNumber = '0';
                        let pair = key.split(/\s+/);
                        if (pair.length > 1)
                            checkNumber = pair[1];
                        this.compilerOutput[checkNumber] = value.replace(/_:_/g, ' : ').replace(/:_/g, ': ').replace(/&quot;/g, '"').replace(/_dollar_/g, '$');
                        if (value.startsWith('ERROR'))
                            this.compilerErrorExpected = true;
                        continue;
                    }
                    if (key == 'test_exe_args' || key == 'test_exe_args2') {
                        let debugCommands = this.debugCommands;
                        let testExeArgs = this.testExeArgs;
                        if (key == 'test_exe_args2') {
                            debugCommands = this.debugCommands2;
                            testExeArgs = this.testExeArgs2;
                        }
                        let sep = value.indexOf('<');
                        if (sep != -1) {
                            let subValue = value.substring(sep);
                            debugCommands.push(...subValue.split(/;\s*/));
                            if (subValue != '<continue; wait 4; <exit')
                                logger.log(this.name + ' : debugger commands = ' + subValue);
                        }
                        if (sep != 0) {
                            if (sep > 0)
                                value = value.substring(0, sep).trim();
                            testExeArgs.push(...value.split(/\s+/));
                            if (value != '-URTS_DEBUG=quit')
                                logger.log(this.name + ' : executable arguments = ' + value);
                        }
                        continue;
                    }
                    if (key == 'timeout') {
                        this.timeout = value;
                        logger.log(this.name + ' : timeout = ' + value);
                        continue;
                    }
                    if (key == 'executable') {
                        this.executable = value;
                        logger.log(this.name + ' : executable = ' + value);
                        continue;
                    }
                    if (key == 'big_test') {
                        this.isBigTest = true;
                        logger.log(this.name + ' : big_test = yes');
                        continue;
                    }
                    if (key == 'max_duration_transform' || key == 'max_duration_generate_source' || key == 'max_duration_generate_makefile') {
                        this[key] = Number(value);
                        continue;
                    }
                    if (key == 'stdout_comparison' || key == 'stderr_comparison') {
                        this[key] = value; 
                        continue;
                    }                
                    if (key == 'allow_stderr_printouts') {
                        this[key] = value;
                        continue;
                    }
    
                    // else the key must be a filename with comparison specification
                    let [first, ...rest] = key.split(':');
                    if (rest.length > 0) {
                        // fix key and value parts if there are several ": " in specification
                        key = first;
                        value = rest.join(':').replace(/^\s+/, '') + ': ' + value;
                    }
                    let fileAndPosition = key.split(/\s+/);
                    let genFileName = fileAndPosition[0];
                    let filePos = fileAndPosition[1];
                    let filePath = this.outDir + '/' + genFileName;
                    if (!curCompareInfo || curCompareInfo.filePath != filePath) {
                        curCompareInfo = {};
                        curCompareInfo.filePath = filePath;
                        curCompareInfo.lines = {};
                        this.compareInfo.push(curCompareInfo);
                        logger.log(this.name + ' : compare generated file : ' + genFileName);
                    }
                    curCompareInfo.lines[filePos] = value.replace(/_:_/g, ' : ').replace(/_dollar_/g, '$').replace(/:_/g, ': ').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
                }//for (var key in metadata)
    
                let numOutputLines = Object.keys(this.compilerOutput).length;
                if (numOutputLines == 1) {
                    logger.log(this.name + ' : compare ' + argv.compilerName + ' output : ' + this.compilerOutput[Object.keys(this.compilerOutput)[0]]);
                } else if (numOutputLines > 1) {
                    logger.log(this.name + ' : compare ' + numOutputLines + ' lines in ' + argv.compilerName + ' output');
                }
                if (this.compilerErrorExpected)
                    logger.log(this.name + ' : ' + argv.compilerName + ' ERROR is expected');
            }
        }

        this.readTestDescription();

		if (!testCaseSteps.startsWith('clean'))
			testCaseSteps = 'clean, ' + testCaseSteps;
        this.steps = testCaseSteps.split(/,\s*/);

		if (this.steps.includes('execute') || this.steps.includes('execute-pass')) {
			this.doExecute = true;
			if (this.debugCommands.length == 0 && this.testExeArgs.length == 0)
				this.testExeArgs.push('-URTS_DEBUG=quit');
		}

		this.checkDuration = function(m, stepName, limit) {
			let msg;
			if (m) {
				let duration = (m[1] == m[4] ? 0 : 3600) + Number(m[5])*60 + Number(m[6]) - Number(m[2])*60 - Number(m[3]);
				let inLimits = (duration <= limit);
				msg = (inLimits ? '' : 'FAIL: ') + stepName + ' duration = ' + duration + ' seconds (' + m[1] + ':' + m[2] + ':' + m[3] + ' --> ' + m[4] + ':' + m[5] + ':' + m[6] + '), max limit = ' + limit + ' seconds';
				logger.log(this.name + ' : ' + msg);
				this.addToBuildLog(msg + '\n');
				if (!inLimits)
					this.errorMsg = msg;
				return inLimits;
			} else {
				msg = 'FAIL to extract timestamps for ' + stepName + ' duration from build log';
				logger.log(this.name + ' : ' + msg);
				this.addToBuildLog(msg + '\n');
				this.errorMsg = msg;
				return false;
			}
		}

        this.checkCompilerOutput = function () {
            let numOutputLines = Object.keys(this.compilerOutput).length;
            if (numOutputLines == 0)
                return true;

            let verdict = true;
            let compareLog = '';
            let msg =  'Comparing ' + argv.compilerName + ' output';
            logger.log(this.name + ' : ' + msg + ' ...');
            let wordsToMatch = [];
            for (var key in this.compilerOutput) {
                let line = this.compilerOutput[key];

                if (key.startsWith("match")) {
                    // This special key means that the line should be split on | to get words
                    // that must be present (in that specific order) in the build log
                    const words = line.split('|');
                    wordsToMatch.push(...words);                    
                }
                else {
                    if (this.buildLog.includes(line)) {
                        compareLog += 'OK(exact match): ' + line + '\n';
                    } else if (this.buildLog.match('(.*)' + line + '(.*)')) {
                        compareLog += 'OK(matches regexp): ' + line + '\n';
                    } else {
                        let msg1 = 'ERROR: missing in ' + argv.compilerName + ' output : ' + line;
                        logger.log(this.name + ' : ' + msg1);
                        compareLog += msg1 + '\n';
                        verdict = false;
                    }
                }
            }

            if (wordsToMatch.length > 0) {
                // Word matching
                let index = 0;
                let count = 0;
                for (var word of wordsToMatch) {
                    count++;
                    index = this.buildLog.indexOf(word, index);
                    if (index == -1) {
                        let msg1 = 'ERROR: matching failed for "' + word + '" (word no ' + count + ') in ' + argv.compilerName + ' output';
                        logger.log(this.name + ' : ' + msg1);
                        compareLog += msg1 + '\n';
                        verdict = false;
                        break;
                    }
                }
                if (verdict)
                    compareLog += 'OK(all words match)\n';
            }

            this.addToBuildLog(logger.heading(msg));
            this.addToBuildLog(compareLog);

            if (verdict) {
                msg = 'PASS : ' + argv.compilerName + ' output';
            } else {
                msg = 'FAIL : ' + argv.compilerName + ' output differs';
				this.errorMsg = msg;
                logger.log(this.name + ' : ' + msg + '!');
            }
            this.addToBuildLog(msg + '\n');

			if (!verdict)
				return verdict;

			if (this.max_duration_transform) {
				let tm = this.buildLog.match(/(\d\d):(\d\d):(\d\d) : INFO : Transforming model\.\.\.[\s\S]*(\d\d):(\d\d):(\d\d) : INFO : Generating source files\.\.\./);
				verdict = this.checkDuration(tm, 'Transform model', this.max_duration_transform) && verdict;
			}
			if (this.max_duration_generate_source) {
				let gm = this.buildLog.match(/(\d\d):(\d\d):(\d\d) : INFO : Generating source files\.\.\.[\s\S]*(\d\d):(\d\d):(\d\d) : INFO : Generated \d+ files/);
				verdict = this.checkDuration(gm, 'Generate source files', this.max_duration_generate_source) && verdict;
			}
			if (this.max_duration_generate_makefile) {
				let gm = this.buildLog.match(/(\d\d):(\d\d):(\d\d) : INFO : Generating Makefiles\.\.\.[\s\S]*(\d\d):(\d\d):(\d\d) : INFO : Generating Makefiles\.\.\. Done/);
				verdict = this.checkDuration(gm, 'Generate makefiles', this.max_duration_generate_makefile) && verdict;
			}

            return verdict;
        }

        if (fs.existsSync(this.topProjectPath + '/top' + this.postfix + '.tcjs')) {
            this.tcjsFile = 'top' + this.postfix + '.tcjs';
            if (argv.modelCompilerJar && !argv.artIntegration) {                
                this.exeTarget = this.outDir + '/top' + this.postfix + '_target';
            }
            else {
                // For the Art Compiler we require always a single top.tcjs in test folder
                // (or several variant TCs on the form top_<postfix>.tcjs)
                this.exeTarget = this.outDir + '/' + this.name + this.postfix + '_target';
                if (this.withNestedFolders) {
                    // When there are nested folders append the target of the top project where we expect the test executable to be located
                    this.exeTarget += '/' + this.topProject + '_target';
                }
            }
        } else {
            this.tcjsFile = 'top.tcjs';
            this.exeTarget  = this.outDir + '/top_target';
        }
        if (this.steps.includes('execute-pass') || this.steps.includes('execute') && fs.readFileSync(this.topProjectPath + '/' + this.tcjsFile, 'utf8').includes('TestRTSUtils')) {
            this.testExeExpectPASSstdout = true;
            logger.log(this.name + ' : expecting ***PASS*** in stdout');
        }

        this.getLogContent = function (fileContents) {
            return fileContents.replace(/\r/g, '').replace(/  Task [0-9] detached/g, '').replace(/RTS debug: \*>/g, '').split(/\n/).filter(function(elem, i) {
                if (!elem) // filter out empty lines
                    return false;
                if (/Target Run Time System/.test(elem))
                    return false;
                if (/Built by Code RealTime Community Edition/.test(elem))
                    return false;
                if (/targetRTS: observability listening not enabled/.test(elem))
                    return false;
                if (/RTS debug: ->  continue/.test(elem))
                    return false;
                return true;
            });
        }

        let fileWithPostfix = this.topProjectPath + '/stdout' + this.postfix + '.txt';
        let stdoutFile = fs.existsSync(fileWithPostfix) ? fileWithPostfix : this.topProjectPath + '/stdout.txt';
        if (fs.existsSync(stdoutFile)) {
            const fileContents = fs.readFileSync(stdoutFile, 'utf8');
            this.goldenStdout = this.getLogContent(fileContents);
        }

        fileWithPostfix = this.topProjectPath + '/stderr' + this.postfix + '.txt';
        let stderrFile = fs.existsSync(fileWithPostfix) ? fileWithPostfix : this.topProjectPath + '/stderr.txt';
        if (fs.existsSync(stderrFile)) {
            const fileContents = fs.readFileSync(stderrFile, 'utf8');
            this.goldenStderr = this.getLogContent(fileContents);
        }        

        this.compareExeLog = function(goldenLog, exeLog, stream) {
            let verdict = true;
            let testCase = this;
            let compareMode = (testCase[stream + '_comparison'] == 'contains') ? 'contains' : 'exact';            

            let msg;
            let expectEmpty = false;

            if (!goldenLog) {
                goldenLog = [];
                msg = 'Checking so that executable ' + stream + ' log is empty! (Compare mode: ' + compareMode + ')';
                expectEmpty = true;
            }
            else {
                msg = 'Comparing executable ' + stream + ' log with golden log in ' + stream + '.txt (Compare mode: ' + compareMode + ')';                
            }

            logger.log(testCase.name + ' : ' + msg);
            this.addToTestLog(logger.heading(msg), stream);
            if (compareMode == 'contains' || goldenLog.length == exeLog.length) {
                goldenLog.forEach(function(elem, i, arr) {                
                    if ((compareMode == 'exact' && elem !== exeLog[i]) ||
                        (compareMode == 'contains' && !exeLog.includes(elem))) {
                        verdict = false;
                        let line = i+1;
                        let msg1 = 'DIFF ' + stream + '.txt(' + line + ') : ' + elem;
                        let msg2 = 'DIFF exe output(' + line + ') : ' + exeLog[i];
                        logger.log(testCase.name + ' : ' + msg1);
                        logger.log(testCase.name + ' : ' + msg2);
                        testCase.addToTestLog(msg1 + '\n', stream);
                        testCase.addToTestLog(msg2 + '\n', stream);
                    }                    
                });
                
                return verdict;
            }

            if (expectEmpty) {
                msg = 'FAIL : Executable ' + stream + ' contains unexpected printouts';
                testCase.addToTestLog(msg + '!\n', stream);
            }
            else {
                msg = 'FAIL : Executable ' + stream + ' differs';
                testCase.addToTestLog(msg + ':\n', stream);
            }
            logger.log(testCase.name + ' : ' + msg + '!');
            
			testCase.errorMsg = msg;
            goldenLog.forEach( line => { testCase.addToTestLog(line + '\n', stream); });
            return false;
        }

        this.checkExeLogs = function() {
			if (this.name.startsWith('sanity_check')) {
				let versionMatch = this.testLogStdErr.match(/Target Run Time System - Release (\d\.\d\.\d\d)/);
				if (versionMatch) {
					logger.log(this.name + ' : Executed with TargetRTS version ' + versionMatch[1]);
				} else {
					let msg = 'FAIL: TargetRTS version was not printed to stderr';
					logger.log(this.name + ' : ' + msg + '!');
					this.addToTestLog(msg + '\n', 'stderr');
					this.errorMsg = msg;
					return false;
				}
			}
            if (this.goldenStdout && !this.compareExeLog(this.goldenStdout, this.getLogContent(this.testLogStdOut), 'stdout')) {
                return false;
            }            
            if (this.goldenStderr && !this.compareExeLog(this.goldenStderr, this.getLogContent(this.testLogStdErr), 'stderr')) {
                return false;
            }
            else if (!this.allow_stderr_printouts && !this.compareExeLog(null, this.getLogContent(this.testLogStdErr), 'stderr')) {
                // Not allowing stderr printouts is the same as having an empty golden stderr file
                return false;
            }
            return true;
        }

        this.buildLog = '';
        this.testLogStdOut = '';
        this.testLogStdErr = '';
        this.state = 'Pending';
		this.errorType = '';
		this.errorMsg = '';

        // Called when the build of the testcase has completed
        this.buildCompleted = function (code) {
            this.buildResultCode = code;
            this.state = 'Built';    
            webServer.notifyClients('testCaseUpdate', this);
        }

        // Called when the testcase is completely finished. The elapsed time is then measured.
        this.finished = function () {
            this.endTime = new Date();
            webServer.notifyClients('testCaseUpdate', this);

            if (registry.allTestsFinished()) {
                registry.onAllTestsFinishedCallback();
            }
        }

        // Determines if the testcase is finished
        this.isFinished = function () {
            return this.hasOwnProperty('endTime') && this.endTime != null;
        }

        // Determines if the testcase has failed (either build failure or runtime failure)
        this.hasFailed = function () {
            return this.isFinished() && (!this.hasOwnProperty('verdict') || this.verdict == 'failed');
        }

        // Returns the time it took to build and run the testcase.
        this.getTimeSpent = function () {
            if (!this.isFinished())
                return null;

            return Math.floor((this.endTime - this.startTime) / 1000);
        }

        // Set the current state of the testcase
        this.setState = function (state) {
            this.state = state;
			if (state == 'Started')
				this.startTime = new Date();
            webServer.notifyClients('testCaseUpdate', this);
        }
    
        // Set the verdict of the testcase (true if it passed, false if it failed)
        this.setVerdict = function (verdict) {
            this.verdict = verdict ? 'passed' : 'failed';
            webServer.notifyClients('testCaseUpdate', this);
        }

        // Add the message to the testcase build log
        this.addToBuildLog = function (msg) {
            this.buildLog += msg;
            webServer.notifyClients('buildLogUpdate', this);
        }

        // Add the message to the testcase test log.
        // 'stream' should be either 'stderr' or 'stdout' (we maintain these logs separately)
        this.addToTestLog = function (msg, stream) {
            if (stream == 'stdout')
                this.testLogStdOut += msg;    
            else if (stream == 'stderr')
                this.testLogStdErr += msg;    
            webServer.notifyClients('testLogUpdate', this);
        }

        // Reset a testcase so that it's ready to be run again
        this.reset = function() {            
            this.buildLog = '';
            this.testLogStdOut = '';
            this.testLogStdErr = '';
            this.state = 'Pending';
            this.startTime = new Date();
			this.errorType = '';
			this.errorMsg = '';

            // Delete dynamic properties such as 'verdict' etc
            delete this.verdict;
            delete this.endTime;
            delete this.buildResultCode;

            // Read the test description file again in case it has changed
            this.readTestDescription();

            webServer.notifyClients('testCaseUpdate', this);
        }
        
    }

    return TestCase;
}

