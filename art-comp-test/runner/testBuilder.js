const child_process = require('child_process');
const fs = require('fs-extra');
const os = require('os');
const util = require('util');
const logger = require('./logger');

module.exports = function(argv) {   
    let module = {};

    // Get the compiler arguments to use for building the testcase
    function getCompilerArgs(testCase, doBuild, doArtExport) {
        let isModelCompilerCall = doArtExport || argv.isModelCompiler;
        let isArtCompilerCall = !isModelCompilerCall;

        let compilerJar = isModelCompilerCall ? argv.modelCompilerJar : argv.artCompilerJar;
        let d = compilerJar.split('/');
        d.pop();

        let commonJvmArgs = [
            '-Xverify:none',
            (testCase && testCase.isBigTest ? '-Xmx4024m' : '-Xmx256m'), // Test models are small so don't allocate excessive memory
            /*TODO: If needed expose these with command-line arguments 
            '-Dorg.eclipse.wst.jsdt.chromium.debug.ui.chromium_debug_host=localhost',
            '-Dorg.eclipse.wst.jsdt.chromium.debug.ui.chromium_debug_port=9222',
            */
            '-Djava.library.path=' + d.join('/') + (isModelCompilerCall ? '/modelcompiler_lib' : '/lib')
        ];

        if (isModelCompilerCall) {
            // Set JVM args specific for the Model Compiler
            commonJvmArgs.push('-DRSA_RT_HOME=' + argv.rsaRTHome);
            if (!fs.existsSync(argv.rsaRTHome + '/tools')) {
                commonJvmArgs.push('-DRTToolsVariable=' + d.join('/'));
            }
        }

        if (argv.artIntegration) {
            commonJvmArgs.push('-DART_COMPILER=' + argv.artCompilerJar);
        }

        let commonMinusJar = [
            '-jar',
            compilerJar
        ];

        let commonCompilerArgs = [];
        if (isModelCompilerCall && argv.licenseArg)
            commonCompilerArgs.push(argv.licenseArg);

        if (testCase && testCase.isFullCommandLine) {
            if (testCase.compilerCmdArgs.length == 0)
                return commonJvmArgs.concat(testCase.compilerJVMArgs).concat(commonMinusJar);
            else
                return commonJvmArgs.concat(testCase.compilerJVMArgs).concat(commonMinusJar).concat(testCase.compilerCmdArgs).concat(commonCompilerArgs);
        }

        // build variants
        if (!doArtExport) {
            let buildVariantsConfig = 'Target Platform = ' + argv.targetConfig;
            if (argv.oldCpp)
                buildVariantsConfig += '; C++ Dialect = C++ 98 (ANSI)';
            commonCompilerArgs.push('--buildVariants=' + argv.buildVariants);
            commonCompilerArgs.push('--buildConfig=' + buildVariantsConfig);
        }

        if (isModelCompilerCall) {
            // root folders
            commonCompilerArgs.push('--root');
            commonCompilerArgs.push(argv.testUtils);
            if (testCase) {
                commonCompilerArgs.push('--root');
                commonCompilerArgs.push(testCase.projectsDir);
            }
        } else if (!argv.artExport) { // Art Compiler test chain
            if (testCase && testCase.group && testCase.group != 'validation') {
                // Except for validation tests, we should report all warnings as errors 
                // (to make sure tests are free from warnings). But disable the validation rule
                // TC_7018_withoutCodeStandard since we haven't set the code standard in tests.
                commonCompilerArgs.push('--ruleConfig=E*,X7018');
            }
            if (argv.codeWorkspace) {
                commonCompilerArgs.push('--ws');
                commonCompilerArgs.push(argv.codeWorkspace);
            }
        }

        // out folder
        if (testCase)
            commonCompilerArgs.push('--out=' + testCase.outDir);
        else
            commonCompilerArgs.push('--out=' + (argv.artExport ? argv.artExportDir : argv.artIntegration ? argv.artIntegrationDir : argv.testDir));

        if (!testCase)
            return commonJvmArgs.concat(commonMinusJar).concat(commonCompilerArgs);

        // test case specific settings
        commonJvmArgs.push('-Dworkspace_loc=' + testCase.projectsDir);
        if (argv.oldCpp && !testCase.compilerCmdArgs.some(arg => arg.startsWith('--codeStandard')))
            commonCompilerArgs.push('--codeStandard=c++98');

        let generateBuildArgs = [];
        if (doArtExport) {
            generateBuildArgs.push('--exportArt');
            generateBuildArgs.push('--validate=-tc');
        } else if (doBuild) {
            // Model Compiler is only generating by default
            if (isModelCompilerCall && testCase.compilerCmdArgs.every((elem) => !elem.startsWith('--build')))
                generateBuildArgs.push('--build');
        } else { // generate
            if (isArtCompilerCall)
                generateBuildArgs.push('--generate');
        }
        if (isArtCompilerCall)
            generateBuildArgs.push('--tc');
        generateBuildArgs.push(testCase.tcjsFile);

        return commonJvmArgs.concat(testCase.compilerJVMArgs).concat(commonMinusJar).concat(commonCompilerArgs).concat(generateBuildArgs).concat(testCase.compilerCmdArgs);
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

    module.printCommonArgs = function () {
        let compilerArgs = getCompilerArgs();
        logger.logSeparator();
        logger.log(argv.compilerName + ' common command line :');
        logger.log(argv.javaVM + ' ' + compilerArgs.join(' '));
        console.log(compilerArgs);
    }

    // Builds the testcase and calls onBuildCompleted when done
    module.buildTest = function(testCase, stepName, onBuildCompleted) {
        let doBuild = (stepName == 'generate-build');
        let doArtExport = (stepName == 'exportArt');
        let isModelCompilerCall = doArtExport || argv.isModelCompiler;

        let compilerArgs = getCompilerArgs(testCase, doBuild, doArtExport);
        let compilerName = isModelCompilerCall ? 'Model Compiler' : 'Art Compiler';

        let logLine = testCase.name + ' : ';
        if (doArtExport) {
            testCase.addToBuildLog('\nExporting ' + testCase.name + ' to Art with Model Compiler :' + os.EOL);
            logLine += 'Exporting to art ... ';
        } else if (doBuild) {
            testCase.addToBuildLog('\nBuilding testcase ' + testCase.name + ' with ' + compilerName + ':' + os.EOL);
            logLine += 'Building ... ';
        } else {
            testCase.addToBuildLog('\nGenerating code for ' + testCase.name + ' with ' + compilerName + ':' + os.EOL);
            logLine += 'Generating ... ';
        }
        testCase.addToBuildLog(argv.javaVM + ' ' + compilerArgs.join(' ') + os.EOL);

        if (testCase.compilerJVMArgs.length)
            logLine += testCase.compilerJVMArgs.join(' ') + ' ... ';
        if (!testCase.isFullCommandLine)
            logLine += testCase.tcjsFile;
        if (testCase.compilerCmdArgs.length)
            logLine += ' ' + testCase.compilerCmdArgs.join(' ');
        logger.log(logLine);

        let childProcess;

        try {
            childProcess = child_process.spawn(argv.javaVM, compilerArgs, { env : getEnvVars(testCase), cwd: testCase.topProjectPath });
        }
        catch (err) {
            logger.log('Failed to launch ' + compilerName + ' for test case: ' + testCase);
            logger.log(err);
            onBuildCompleted(false);
            return;
        }

        testCase.setState('Building');

        childProcess.on('error', (err) => {
            logger.log('Error occurred when ' + compilerName + ' was launched for test case: ' + testCase);
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
                    let msg = 'ERROR message and non-zero return code are expected from ' + compilerName + ', but received code == 0';
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
            if (doArtExport) {
                onBuildCompleted((code == 0) && updateTestCaseAfterArtExport(testCase));
            } else {
                onBuildCompleted((code == 0) && testCase.checkCompilerOutput());
            }
        });
    }

    function updateProperty(testCase, before, after, propName, newValue) {
        before[propName] = testCase[propName];
        if (newValue) testCase[propName] = newValue;
        after[propName] = testCase[propName];
    }

    function updateTestCaseAfterArtExport(testCase) {
        testCase.addToBuildLog('\nUpdating test case to Art exported location ...\n');

        let before = {}, after = {};
        updateProperty(testCase, before, after, 'projectsDir', testCase.outDir);
        updateProperty(testCase, before, after, 'tcjsFile');

        let exportedTopProjectPath = testCase.outDir + '/' + testCase.topProject;
        let tcjsFilePath = exportedTopProjectPath + '/' + testCase.tcjsFile;
        try {
            // For Art TC executable name is top capsule name by default, so need to manually define it to be Top
            fs.appendFile(tcjsFilePath, '\ntc.executableName=\'Top$(EXEC_EXT)\';');
        } catch (err) {
            console.log('ERROR: Failed to append executableName to ' + tcjsFilePath);
            return false;
        }

        updateProperty(testCase, before, after, 'outDir');
        updateProperty(testCase, before, after, 'topProjectPath', exportedTopProjectPath);
        updateProperty(testCase, before, after, 'topProject');
        updateProperty(testCase, before, after, 'exeTarget', testCase.outDir + '/' + testCase.tcjsFile.slice(0, -5) + '_target');
        updateProperty(testCase, before, after, 'executable', '/default/Top');

        testCase.addToBuildLog('Before:\n' + util.format(before) + '\n');
        testCase.addToBuildLog('After:\n' + util.format(after) + '\n');

        // temp solution: copy testLib.* files into TestRTSUtils exported location
        let exportedTestRTSUtils = testCase.outDir + '/TestRTSUtils';
        let testLibContainer = argv.testUtils + '/TestUtils';
        try {
            fs.copySync(testLibContainer + '/testLib.h', exportedTestRTSUtils + '/testLib.h');
            fs.copySync(testLibContainer + '/testLib.cpp', exportedTestRTSUtils + '/testLib.cpp');
            testCase.addToBuildLog('Copy ' + testLibContainer + '/testLib.* to ' + exportedTestRTSUtils + '/testLib.*\n');
        } catch (err) {
            console.log('ERROR: Failed to copy ' + testLibContainer + '/testLib.* into ' + exportedTestRTSUtils);
            return false;
        }

        return true;
    }

    function replaceTextInFile(projectPath, fileName, text, replaceText) {
        let filePath = projectPath + '/' + fileName;
        let content = fs.readFileSync(filePath, 'utf8', 'r');
        const newContent = content.replaceAll(text, replaceText);
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }

    // Copy projects and update test case for running Art integration test with Model Compiler
    module.prepareArtIntegration = function (testCase) {
        logger.log(testCase.name + ' : Preparing Art integration ...');
        testCase.addToBuildLog('\nCopying test case to Art integration location and updating ...\n');
        let before = {}, after = {};

        updateProperty(testCase, before, after, 'outDir', argv.artIntegrationDir + '/' + testCase.name);
        try {
            fs.mkdirSync(testCase.outDir);
            let artPath = testCase.outDir + '/' + testCase.topProject;
            let mrtPath = testCase.outDir + '/' + testCase.name + '_mrt';

            // Prepare Art project
            if (testCase.withNestedFolders)
                fs.copySync(testCase.projectsDir, testCase.outDir, { recursive: true });
            else
                fs.copySync(testCase.topProjectPath, artPath, { recursive: true });
            replaceTextInFile(artPath, 'top.tcjs', 'tc.topCapsule', '//tc.topCapsule');
            // Art integration does not support passing --ws option to Art Compiler, so change to relative path
            replaceTextInFile(artPath, 'top.tcjs', '${ws:TestUtils}/testlib.tcjs', '../../utils/TestUtils/testlib.tcjs');
            fs.copySync(argv.modelRTTemplate + '/.project', artPath + '/.project');
            replaceTextInFile(artPath, '.project', 'ReplaceTextProjectName_mrt', testCase.name);
            if (!fs.existsSync(artPath + '/' + testCase.name + '.art')) {
                let mainArtFile;
                if (fs.existsSync(artPath + '/Top.art')) mainArtFile = 'Top.art';
                else if (fs.existsSync(artPath + '/top.art')) mainArtFile = 'top.art';
                else if (fs.existsSync(artPath + '/main.art')) mainArtFile = 'main.art';
                else {
                    logger.log('ERROR: Failed to find main Art file for test case ' + testCase.name);
                    return false;
                }
                fs.renameSync(artPath + '/' + mainArtFile, artPath + '/' + testCase.name + '.art');
            }

            // Copy ModelRT project from template and update
            fs.copySync(argv.modelRTTemplate, mrtPath, { recursive: true });
            updateProperty(testCase, before, after, 'topProjectPath', mrtPath);
            replaceTextInFile(mrtPath, '.project', 'ReplaceTextProjectName', testCase.name);
            replaceTextInFile(mrtPath, 'top_mrt.tcjs', 'ReplaceTextProjectName', testCase.name);
            replaceTextInFile(mrtPath, 'CPPModel.emx', 'ReplaceTextProjectName', testCase.name);
        } catch (err) {
            console.log(err);
            return false;
        }

        updateProperty(testCase, before, after, 'projectsDir', testCase.outDir);
        updateProperty(testCase, before, after, 'tcjsFile', 'top_mrt.tcjs');
        updateProperty(testCase, before, after, 'exeTarget', testCase.outDir + '/top_mrt_target');

        testCase.addToBuildLog('Before:\n' + util.format(before) + '\n');
        testCase.addToBuildLog('After:\n' + util.format(after) + '\n');

        return true;
    }

    // Clean a test (by removing its target folder) and calls onCleanCompleted when done
    module.cleanTest = function (testCase, onCleanCompleted) {
        logger.log(testCase.name + ' : Cleaning in ' + testCase.outDir + ' ...');

        let targetFolders = [];
        if (testCase.postfix && testCase.outDir.endsWith('/' + testCase.postfix)) {
            targetFolders.push(testCase.outDir);
        } else {
            for (let ff of fs.readdirSync(testCase.outDir, { withFileTypes: true })) {
                if (!ff.isDirectory())
                    continue;
                if (ff.name.endsWith('_target'))
                    targetFolders.push(testCase.outDir + '/' + ff.name);
            }
        }

        for (let targetFolder of targetFolders) {
            fs.rmSync(targetFolder, { recursive: true, force: true }, (err) => {
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

    module.getCompilerVersions = function() {
        if (argv.modelCompilerJar) {
            this.getCompilerVersion(argv.modelCompilerJar, 'Model Compiler', 'Version : ',
                    argv.artExport || !argv.artIntegration);
        }
        if (argv.artCompilerJar) {
            this.getCompilerVersion(argv.artCompilerJar, 'Art Compiler', 'Art Compiler',
                    argv.artIntegration || !argv.artExport);
        }
        // Also get the version of TargetRTS
        logger.logSeparator();
        logger.log('TargetRTS location     : ' + argv.targetRTSDir);
        let versionMatch = fs.readFileSync(argv.targetRTSDir + '/include/RTVersion.h', 'utf8').match(/Release (\d\.\d\.\d\d)/);
        logger.log('TargetRTS version      : ' + versionMatch[1]);
        argv.targetRTSVersion = versionMatch[1];
        logger.logSeparator();
    }

    // Get version of Model/Art Compiler by executing its JAR file with --version argument and reading output
    module.getCompilerVersion = function(compilerJar, compilerName, versionPrefix, isMainVersion) {
        logger.logSeparator();
        logger.log('Checking ' + compilerName + ' version ...');
        let versionArgs = [
            '-jar',
            compilerJar,
            '--version'
        ];
        console.log(argv.javaVM + ' ' + versionArgs.join(' '));
        const result = child_process.spawnSync(argv.javaVM, versionArgs);
        if (result.stderr) logger.log(result.stderr.toString());
        if (result.error) logger.log(result.error);
        if (result.status !== 0) process.exit(result.status);
        if (result.error) process.exit(1);

        const outData = result.stdout.toString();
        for (let line of outData.split(/\r?\n/)) {
            let i = line.indexOf(versionPrefix);
            if (i > -1) {
                let versionString = line.substring(i + versionPrefix.length).trim();
                logger.log(compilerName.padEnd(14) + ' version : ' + versionString);
                if (isMainVersion) {
                    argv.compilerVersion = versionString.split(' ')[0];
                    logger.log('compilerVersion        : ' + argv.compilerVersion);
                }
                break;
            }
        }
    }

    return module;
}
