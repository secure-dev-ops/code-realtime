const fs = require('fs-extra');
const logger = require('./logger');
const path = require('path');
const { log } = require('console');

module.exports = function(TestCase, argv) {    
    let module = {};
    
    let testCases = [];
    let testCasesMap = {};
    let testDirFullPath = path.resolve(argv.testDir).split(path.sep).join('/');
    let artIntegrationTestExTempPath = testDirFullPath + '/../artIntegrationTestExecution/';

    module.allCasesWithNestedFolders = true;

    function isTestCaseDescriptionFile(ff) {
        return ff.isFile() && (ff.name == 'testcase.txt' || /^testcase.*\.md$/.test(ff.name));
    }

    async function artIntegrationSetupFunction() {
        const status = await createArtIntegrationTestSetup();
    }

    function createArtIntegrationTestSetup() {

        return new Promise((resolve, reject) => {
            //Create a tempororay folder for running art integration tests

            if (fs.existsSync(artIntegrationTestExTempPath)) {
                fs.removeSync(artIntegrationTestExTempPath);
            }
            fs.mkdirSync(artIntegrationTestExTempPath);
            let testCasesToBeExecuted = [];
            let items = fs.readdirSync(argv.testDir, { withFileTypes: true });
            for (let item of items) {
                if (!item.isDirectory() || item.name.endsWith('_target') || item.name == 'TestRTSUtils')
                    continue;

                if (argv.testCases && !argv.testCases.includes(item.name))
                    continue; // Not included in the list of testcases to run
                testCasesToBeExecuted.push(item);

            }
            //Create a folder with name of the art project 

            for (let testCase of testCasesToBeExecuted) {
                let artProjectTempPath = artIntegrationTestExTempPath + testCase.name + '/';
                let artProjectPath = argv.testDir + '/' + testCase.name + '/';
                let projectFiles = fs.readdirSync(artProjectPath, { withFileTypes: true });

                let filesToBeCopiedToMRTProj = [];

                projectFiles.forEach(file => {
                    if (file.name.endsWith('.md') || file.name.endsWith('.js')) {
                        filesToBeCopiedToMRTProj.push(file);
                    }
                });



                fs.mkdirSync(artProjectTempPath);


                // Copy all the files from the art project path to the temporary art project path
                fs.cpSync(artProjectPath, artProjectTempPath, { recursive: true });

                //Remove the testcase.md from the temporary art project path
                let testCaseMdPath = path.join(artProjectTempPath, 'testcase.md');
                if (fs.existsSync(testCaseMdPath)) {
                    fs.unlinkSync(testCaseMdPath);

                }

                //Create MRT project folder 
                let mrtProjectName = testCase.name + '_mrt';
                let mrtProjectPath = artIntegrationTestExTempPath + mrtProjectName + '/';
                let templateFilesLocation = testDirFullPath + '/../testTemplates/'
                if (!(fs.existsSync(mrtProjectPath))) {
                    fs.mkdirSync(mrtProjectPath);
                }
                // copy the emx and tcjs template files and update its values
                let templateFiles = fs.readdirSync(templateFilesLocation, { withFileTypes: true });
                templateFiles.forEach(file => {
                    fs.copyFileSync(path.join(templateFilesLocation, file.name), path.join(mrtProjectPath, file.name));
                    if (file.name == '.project') {
                        fs.copyFileSync(path.join(templateFilesLocation, file.name), path.join(artProjectTempPath, file.name));
                    }
                });

                // copy testcase.md  file
                filesToBeCopiedToMRTProj.forEach(file => {
                    fs.copyFileSync(path.join(artProjectPath, file.name), path.join(mrtProjectPath, file.name));
                });
                //Comment  tc.topCapsule in the art tcjs file
                let artProjectFiles = fs.readdirSync(artProjectTempPath, { withFileTypes: true });
                let artFileName = '';

                let excludeTestCase = false;
                artProjectFiles.forEach(file => {

                    if (file.name.endsWith('.tcjs')) {
                        replaceTextInFile(artProjectTempPath, file, /tc.topCapsule/g, '//tc.topCapsule');
                        excludeTestCase = checkForExclusionCondition(artProjectTempPath, file);
                    }
                    else if ((file.name == testCase.name + '.art') || (file.name.toString().toLowerCase() == ('top.art')) || file.name.toString().toLowerCase() == ('main.art')) {
                        artFileName = file.name;
                    } else if (file.name == '.project') {
                        replaceTextInFile(artProjectTempPath, file, /ReplaceTextProjectName/g, testCase.name);
                    }
                });
                
                if (excludeTestCase) {
                    //Remove the testcase.md from the temporary mrt project path.
                    //Some tests are temporarily excluded from running for now since they require some custom changes to be made in the 
                    //model realtime tcjs.
                    let testCaseMdPath = path.join(mrtProjectPath, 'testcase.md');
                    if (fs.existsSync(testCaseMdPath)) {
                        fs.unlinkSync(testCaseMdPath);
                    }
                    continue;
                }

                //Modification in the top.tcjs.
                //Replace the string <ProjectName> with the project name created and replace the string <ArtProjectName> with the project name created in Step 2.
                let mrtProjectFiles = fs.readdirSync(mrtProjectPath, { withFileTypes: true });
                let elementURI = testCase.name + '/' + artFileName + '#::Top#art' + mrtProjectName + '#art';
                mrtProjectFiles.forEach(file => {
                    if (file.name.endsWith('.tcjs')) {
                        replaceTextInFile(mrtProjectPath, file, /ReplaceTextProjectName/g, mrtProjectName);
                        replaceTextInFile(mrtProjectPath, file, /ReplaceTextArtProjectName/g, testCase.name);
                    }
                    else if (file.name == '.project') {
                        replaceTextInFile(mrtProjectPath, file, /ReplaceTextProjectName/g, mrtProjectName);
                    } else if (file.name.endsWith('.emx')) {
                        replaceTextInFile(mrtProjectPath, file, /ReplaceTextElementURI/g, elementURI);
                    }
                })
            }
        });
    }


    // Register test cases found in the directory
    module.registerTestCases = function () {
        let testDirFullPath = path.resolve(argv.testDir).split(path.sep).join('/');
        if (argv.artIntegration) {
            let result = createArtIntegrationTestSetup();
            testDirFullPath = path.resolve(artIntegrationTestExTempPath).split(path.sep).join('/');
        }

        logger.log('Collecting test cases in ' + testDirFullPath + ' ...');
        let items = fs.readdirSync(testDirFullPath, { withFileTypes: true });
        for (let item of items) {
            if (!item.isDirectory() || item.name.endsWith('_target') || item.name == 'TestRTSUtils')
                continue;

            if (argv.testCases && !argv.testCases.includes(item.name))
                continue; // Not included in the list of testcases to run

            // Look for testcase description file (in plain text or markdown)
            // Project with testcase description is the top project in the test
            let projectsDir = testDirFullPath;
            let topProject = item.name;
            let withNestedFolders = false;
            let testCaseFiles = [];
            let testCaseFolder = testDirFullPath + '/' + item.name;
            for (let ff of fs.readdirSync(testCaseFolder, { withFileTypes : true })) {
                if (isTestCaseDescriptionFile(ff)) {
                    testCaseFiles.push(ff.name);
                    continue;
                }
                if (!ff.isDirectory() || ff.name.endsWith('_target'))
                    continue;
                let subFolder = testCaseFolder + '/' + ff.name;
                for (let ff2 of fs.readdirSync(subFolder, { withFileTypes : true })) {
                    if (isTestCaseDescriptionFile(ff2)) {
                        projectsDir = testCaseFolder;
                        topProject = ff.name;
                        withNestedFolders = true;
                        testCaseFiles.push(ff2.name);
                    }
                }
                if (withNestedFolders)
                    break;
            }

            for (let testCaseFile of testCaseFiles) {
                if (!fs.existsSync(projectsDir + '/' + topProject + '/' + testCaseFile)) {
                    // should not happen
                    logger.log('INTERNAL ERROR: testcase file does not exist : ' + projectsDir + '/' + topProject + '/' + testCaseFile);
                    continue;
                }
                let testCase = new TestCase(argv, item.name, testCaseFile, projectsDir, topProject, withNestedFolders, this);
                if (testCase.skipExecution)
                    logger.log(testCase.name + ' : SKIP execution, reason : ' + testCase.skipExecution);
                else {
                    //For art integration mode, only exclude the tests which cannot be executed (like the validation tests)
                    //Build variant specific tests are excluded from the build for now since the build variant script location needs to be updated for art integration mode.
                    //Excluding the tests which require special handling for now.
                    let excludeTest = false;
                    if (argv.artIntegration) {
                        excludeTest = !(testCase.steps.includes('execute-pass') || testCase.steps.includes('execute')) || testCase.compilerCmdArgs.some(arg => arg.startsWith('--buildVariants'));
                    }
                    if (!excludeTest) {
                        testCases.push(testCase);
                    }
                    module.allCasesWithNestedFolders = module.allCasesWithNestedFolders && (withNestedFolders || !testCase.testExeExpectPASSstdout);
                    if (testCasesMap[testCase.name]) {
                        // Should not happen
                        logger.log('WARNING: More than one testcase with name "' + testCase.name + '" exists!');
                    }
                    testCasesMap[testCase.name] = testCase;
                }
            }
        }
        logger.logSeparator();
        logger.log(testCases.length + " testcases found in " + testDirFullPath);
    };

    module.getTestSuiteName = function (){
        return argv.testSuiteName;
    }

    // Get a list of all testcases
    module.getTestCases = function () {
        return testCases;
    }

    // Return the testcase with the specified name
    module.getTestCase = function (name) {
        return testCasesMap[name];
    }

    // Determines if all testcases have finished
    module.allTestsFinished = function () {        
        for (let tc of testCases) {
            if (!tc.isFinished())
                return false;
        }
        return true;
    }

    // Set a callback function to call when all testcases have finished
    module.onAllTestsFinished = function (callback) {
        this.onAllTestsFinishedCallback = callback;
    }

    // Delete all tests from the registry
    module.deleteAll = function () {
        testCases = [];
        testCasesMap = {};
    }

    // Returns the list of failed testcases
    module.getFailedTests = function () {
        let result = [];
        for (let tc of testCases) {
            if (tc.hasFailed())
                result.push(tc);
        }
        return result;
    }

    // Returns the list of finished testcases
    module.getFinishedTests = function () {
        let result = [];
        for (let tc of testCases) {
            if (tc.isFinished())
                result.push(tc);
        }
        return result;
    }

    return module;
}

function replaceTextInFile(projectTempPath, file, text, replaceText) {

    let value = fs.readFileSync(path.join(projectTempPath, file.name), 'utf8', 'r').toString().replaceAll(text, replaceText);
    fs.writeFileSync(path.join(projectTempPath, file.name), value, 'utf8', function (err) {
        if (err) return console.log(err);
    });
}

function checkForExclusionCondition(projectTempPath, file) {
    let contents = fs.readFileSync(path.join(projectTempPath, file.name), 'utf8', 'r').toString();
    return contents.includes('tc.userObjectFiles') || contents.includes('tc.threads') || contents.includes('tc.capsuleFactory');
}

