const { spawn } = require('child_process');
const child_process = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const testCaseRegistry = require('./testCaseRegistry');
const logger = require('./logger');

module.exports = function(argv) {   
    let module = {};

	let testDirFullPath = path.resolve(argv.testDir).split(path.sep).join('/');

    // Get the compiler arguments to use for building the testcase
    function getCompilerArgs(testCase, doBuild) {
        let rsaRTHome, pathSeparator, replaceSeparator;

        if ( argv.targetConfig.indexOf('Visual') > -1 ) {
            pathSeparator = '\\';
            replaceSeparator = '/';
        }
        else {
            pathSeparator = '/';
            replaceSeparator = '\\';
        }

        if (argv.modelCompilerJar && !argv.licenseArg && process.env.RUNNER_LICENSE_ARG) {
            argv.licenseArg = process.env.RUNNER_LICENSE_ARG;
        }

        if (argv.installDir) {
            argv.installDir = argv.installDir.split(replaceSeparator).join(pathSeparator);
            rsaRTHome = argv.installDir + pathSeparator + 'rsa_rt';
        }

		if (argv.targetRTSDir) {
            let d = argv.targetRTSDir.split('/');
            if (d.length < 2) {
                logger.log('Specified TargetRTS directory is invalid. It must conform to the pattern */C++/TargetRTS.');
                process.exit(-1);
            }
            d.pop();
            d.pop();
            rsaRTHome = d.join(pathSeparator);
		}

        let d = argv.compilerJar.split('/');
        d.pop();
        let libPath;
        if (argv.modelCompilerJar) 
            libPath = d.join('/') + '/modelcompiler_lib';
        else
            libPath = d.join('/') + '/lib';

        let commonJvmArgs = [
            '-Xverify:none', 
            ( testCase && testCase.isBigTest ? '-Xmx4024m' : '-Xmx256m' ), // Test models are small so don't allocate excessive memory
            /*TODO: If needed expose these with command-line arguments 
            '-Dorg.eclipse.wst.jsdt.chromium.debug.ui.chromium_debug_host=localhost',
            '-Dorg.eclipse.wst.jsdt.chromium.debug.ui.chromium_debug_port=9222',
            */
            '-Djava.library.path=' + libPath
        ];

        if (argv.modelCompilerJar) {
            // Set JVM args specific for the Model Compiler
            commonJvmArgs.push('-DRSA_RT_HOME=' + rsaRTHome);
            if (!fs.existsSync(rsaRTHome + pathSeparator + 'tools')) {
                commonJvmArgs.push('-DRTToolsVariable=' + d.join(pathSeparator));
            }
        }

        if (argv.artIntegration) {
            commonJvmArgs.push('-DART_COMPILER=' + argv.artCompilerJar);
        }

        let commonMinusJar = [
            '-jar',
            argv.compilerJar
        ];
        if (testCase && testCase.isFullCommandLine && (testCase.name.startsWith('mca_help') || testCase.compilerCmdArgs.length == 0))
            return commonJvmArgs.concat(testCase.compilerJVMArgs).concat(commonMinusJar).concat(testCase.compilerCmdArgs);

        if (argv.licenseArg)
            commonMinusJar.push(argv.licenseArg);

        if (testCase && testCase.isFullCommandLine)
            return commonJvmArgs.concat(testCase.compilerJVMArgs).concat(commonMinusJar).concat(testCase.compilerCmdArgs);

        // The Model Compiler and Art Compiler have rather different command-line arguments...
        let commonCompilerArgs = [];
        if (argv.modelCompilerJar) {
            // Build Model Compiler command-line
            let utilsDir = testDirFullPath + '/../utils';
            if (argv.artIntegration) {
                utilsDir = testDirFullPath + '/../artIntegrationTestExecution/' + '/../utils';
            }
            let rtsUtils = utilsDir + '/TestRTSUtils';
            let buildVariantsConfig = 'Target Platform = ' + argv.targetConfig;
            if (argv.oldCpp)
                buildVariantsConfig += '; C++ Dialect = C++ 98 (ANSI)';

            if (argv.artIntegration) {
                commonCompilerArgs.push('--buildVariants=' + testDirFullPath + '/../TestUtils/testVariants.js');
                commonCompilerArgs.push('--buildConfig=Target Platform = ' + argv.targetConfig);
            } else {
                commonCompilerArgs.push('--buildVariants=' + rtsUtils + '/testvariants.js');
                commonCompilerArgs.push('--buildConfig=' + buildVariantsConfig);
            }
			// Root folders and out folder
			commonCompilerArgs.push('--root');
			commonCompilerArgs.push(utilsDir);
			if (testCase) {
			    commonCompilerArgs.push('--root');
			    commonCompilerArgs.push(testCase.projectsDir);
			    commonCompilerArgs.push('--out=' + testCase.outDir);
			    commonJvmArgs.push('-Dworkspace_loc=' + testCase.projectsDir)
			} else {
			    commonCompilerArgs.push('--out=' + testDirFullPath);
			}


            if (!testCase)
                return commonJvmArgs.concat(commonMinusJar).concat(commonCompilerArgs);

			if (argv.oldCpp && !testCase.compilerCmdArgs.some(arg => arg.startsWith('--codeStandard')))
				commonCompilerArgs.push('--codeStandard=c++98');

            let generateBuildArgs = [];
            if (doBuild && testCase.compilerCmdArgs.every((elem) => !elem.startsWith('--build')) )
                generateBuildArgs.push('--build');
            else if(argv.artIntegration){
                generateBuildArgs.push('--build');
            }
            generateBuildArgs.push(testCase.tcjsFile);

            return commonJvmArgs.concat(testCase.compilerJVMArgs).concat(commonMinusJar).concat(commonCompilerArgs).concat(generateBuildArgs).concat(testCase.compilerCmdArgs);
        }
        else {
            // Build Art Compiler command-line
            commonCompilerArgs.push('--buildVariants=' + testDirFullPath + '/../TestUtils/testVariants.js');
            commonCompilerArgs.push('--buildConfig=Target Platform = ' + argv.targetConfig);            
            if (testCase) {
                if (testCase.group && testCase.group != 'validation') {
                    // Except for validation tests, we should report all warnings as errors 
                    // (to make sure tests are free from warnings). But disable the validation rule
                    // TC_7018_withoutCodeStandard since we haven't set the code standard in tests.
                    commonCompilerArgs.push('--ruleConfig=E*,X7018');
                }
                commonCompilerArgs.push('--out=' + testCase.outDir);
                commonJvmArgs.push('-Dworkspace_loc=' + testCase.projectsDir)
            } else {
                commonCompilerArgs.push('--out=' + testDirFullPath);
            }

            if (!testCase)
                return commonJvmArgs.concat(commonMinusJar).concat(commonCompilerArgs);            

            let generateBuildArgs = [];
            if ( !doBuild || testCase.compilerCmdArgs.some((elem) => elem.startsWith('--generate')) )
                generateBuildArgs.push('--generate');
            generateBuildArgs.push('--tc');
            generateBuildArgs.push(testCase.tcjsFile);
            
            return commonJvmArgs.concat(testCase.compilerJVMArgs).concat(commonMinusJar).concat(commonCompilerArgs).concat(generateBuildArgs).concat(testCase.compilerCmdArgs);
        }
    }

    // Get environment variables to use when launching the model compiler
    function getEnvVars(testCase) {
        let envVars = {...process.env};
        if (argv.targetRTSDir) {
			if (argv.oldCpp)
				envVars.TARGET_RTS_cpp98 = argv.targetRTSDir;
			else
				envVars.TARGET_RTS_DIR = argv.targetRTSDir;
        }
        if (testCase) {
            for (var setting of testCase.env) {
                let keyValuePair = setting.split('=');
                envVars[keyValuePair[0]] = keyValuePair[1];
            }
        }
        return envVars;
    }

    // Builds the testcase and calls onBuildCompleted when done
    module.buildTest = function(testCase, stepName, onBuildCompleted) {
        let doBuild = (stepName == 'generate-build');
        let compilerArgs = getCompilerArgs(testCase, doBuild);
        testCase.addToBuildLog('Building testcase ' + testCase.name + ' with the ' + argv.compilerName + ':' + os.EOL);
        testCase.addToBuildLog(argv.javaVM + ' ');
        testCase.addToBuildLog(compilerArgs.join(' ') + os.EOL);

        let logLine = testCase.name + ' : ' + ( doBuild ? 'Building' : 'Generating' ) + ' ... ';
        if (testCase.compilerJVMArgs.length) 
            logLine += testCase.compilerJVMArgs.join(' ') + ' ... ';
        if (!testCase.isFullCommandLine) {
            if (argv.modelCompilerJar)
                logLine += ( doBuild ? '--build ' : '' ) + testCase.tcjsFile;
            else
                logLine += ( doBuild ? '' : '--generate ' ) + testCase.tcjsFile;
        }
        if (testCase.compilerCmdArgs.length) 
            logLine += ' ' + testCase.compilerCmdArgs.join(' ');
        logger.log(logLine);

        let childProcess;

        try {
            childProcess = spawn(argv.javaVM, compilerArgs, { env : getEnvVars(testCase), cwd: testCase.topProjectPath });
        }
        catch (err) {
            logger.log('Failed to launch ' + argv.compilerName + ' for test case: ' + testCase);
            logger.log(err);
            onBuildCompleted(false);
            return;
        }

        testCase.setState('Building');
    
        childProcess.on('error', (err) => {
            logger.log('Error occurred when ' + argv.compilerName + ' was launched for test case: ' + testCase);
            logger.log(err);
            onBuildCompleted(false);
        });

        childProcess.stdout.on('data', (data) => {
            let dataStr = new String(data);
            testCase.addToBuildLog(dataStr.replace(/‘/g, "'").replace(/’/g, "'"));
            //console.log(`stdout: ${data}`);
        });
    
        childProcess.stderr.on('data', (data) => {
            //console.log(`stderr: ${data}`);
        });
          
        childProcess.on('close', (code) => {
            // Build completed.
            if (testCase.compilerErrorExpected) {
                if (code == 0) {
                    let msg = 'ERROR message and non-zero return code are expected from ' + argv.compilerName + ', but received code == 0';
                    testCase.addToBuildLog(msg + '\n');
					testCase.errorMsg = msg;
                    logger.log(testCase.name + ' : ' + msg);
                    code = -1;
                } else {
                    code = 0;
                }
            } else if (code != 0) {
				let msg = 'Build failed with error code = ' + code;
				testCase.addToBuildLog(msg + '\n');
				testCase.errorMsg = msg;
                logger.log(testCase.name + ' : ERROR : ' + msg);
			}
            testCase.buildCompleted(code);
            onBuildCompleted((code == 0) && testCase.checkCompilerOutput());
        });
    }

    // Clean a test (by removing its target folder) and calls onCleanCompleted when done    
    module.cleanTest = function(testCase, onCleanCompleted) {
        logger.log(testCase.name + ' : Cleaning ... ');
        if (!fs.existsSync(testCase.exeTarget)) {
            onCleanCompleted('Target folder: ' + testCase.exeTarget + ' does not exist!');
            return;
        }

        let targetFolders = [];
        if (testCase.postfix) {
            targetFolders.push(testCase.outDir);
        } else {
            for (let ff of fs.readdirSync(testCase.outDir, { withFileTypes : true })) {
                if (ff.isDirectory() && ff.name.endsWith('_target')) {
                    if (testCase.withNestedFolders || ff.name.startsWith(testCase.name)) {
                        targetFolders.push(testCase.outDir + '/' + ff.name);
                    }
                }
            }
        }

        for (let targetFolder of targetFolders) {
            fs.rm(targetFolder, { recursive: true }, (err) => {
                if (err) {
                    let mess = 'Failed to clean ' + targetFolder + ': ' + err;
                    logger.log(mess);
                    onCleanCompleted(mess);
                    return;
                }
            });
        }

        onCleanCompleted(null);
    }

    // Get version of Model/Art Compiler by executing its JAR file with --help argument and reading output
    module.getCompilerVersion = function() {
        let childProcess;

        logger.logSeparator();
        logger.log('Checking ' + argv.compilerName + ' version ...');
        let versionArgs = [
            '-jar',
            argv.compilerJar,
            '--help'
        ];
        console.log(argv.javaVM + ' ' + versionArgs.join(' '));
        try {
            childProcess = child_process.spawnSync(argv.javaVM, versionArgs);
        }
        catch (err) {
            logger.log('ERROR: Failed to launch ' + argv.compilerName + ' for version check');
            logger.log(err);
            return;
        }
        argv.compilerVersion = '0';
        const outData = `${childProcess.stdout}`;
        argv.toolName = argv.modelCompilerJar ? 'Model RealTime' : 'Code RealTime';
        let versionIdentifier = argv.modelCompilerJar ? 'Version : ' : 'Art Compiler '; // How to identify compiler version
        for (let line of outData.split(/\r?\n/)) {
            let i = line.indexOf(versionIdentifier);
            if (i > -1) {
                argv.compilerVersion = line.substring(i+versionIdentifier.length).trim().toLowerCase();
                break;
            }
        }
        logger.logSeparator();
        logger.log(argv.compilerName + ' version : ' + argv.toolName + ' ' + argv.compilerVersion);
        argv.toolName = argv.toolName.toLowerCase();

		// Also get the version of TargetRTS
		let targetRTSLocation = argv.targetRTSDir ? argv.targetRTSDir : 
            ( argv.installDir + (!argv.artCompilerJar ? "/rsa_rt/C++/TargetRTS" : "/TargetRTS") );
		logger.log('TargetRTS location     : ' + targetRTSLocation);
		let versionMatch = fs.readFileSync(targetRTSLocation + '/include/RTVersion.h', 'utf8').match(/Release (\d\.\d\.\d\d)/);
		logger.log('TargetRTS version      : ' + versionMatch[1]);
		argv.targetRTSVersion = versionMatch[1];
        logger.logSeparator();
    }

    // Builds the test library
    module.buildTestLib = function(allCasesWithNestedFolders, onBuildCompleted) {
        let compilerArgs = getCompilerArgs();

        logger.logSeparator();
        logger.log(argv.compilerName + ' common command line :');
        logger.log(argv.javaVM + ' ' + compilerArgs.join(' '));
        console.log(compilerArgs);

        if (allCasesWithNestedFolders) {
            onBuildCompleted(0);
            return;
        }

        logger.logSeparator();
        compilerArgs.push('--build');
        compilerArgs.push(rtsUtils + '/testRTSlib.tcjs');
        logger.log('Building test library ...  --build ' + rtsUtils + '/testRTSlib.tcjs');
        logger.logSeparator();

        let childProcess;
        try {
            childProcess = spawn(argv.javaVM, compilerArgs, {env : getEnvVars()});
        }
        catch (err) {
            logger.log('Failed to launch model compiler for building test lib');
            logger.log(err);
            onBuildCompleted(-1);
            return;
        }
    
        childProcess.on('error', (err) => {
            logger.log('Failed to launch model compiler for building test lib');
            logger.log(err);
            onBuildCompleted(-1);
        });

        childProcess.stdout.on('data', (data) => {
            process.stdout.write(`${data}`);
        });
    
        childProcess.stderr.on('data', (data) => {
            process.stderr.write(`${data}`);
        });
          
        childProcess.on('close', (code) => {
            // Build completed.            
            onBuildCompleted(code);            
        });        
    }

    return module;
}

