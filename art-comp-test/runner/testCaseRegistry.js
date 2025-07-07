const fs = require('fs-extra');
const logger = require('./logger');

module.exports = function(TestCase, argv) {    
    let module = {};

    let testCases = [];
    let testCasesMap = {};

    function isTestCaseDescriptionFile(ff) {
        return ff.isFile() && (ff.name == 'testcase.txt' || /^testcase.*\.md$/.test(ff.name));
    }

    function addTestCase(projectsDir, testCaseName, testCaseFile, topProject, withNestedFolders, registry) {
        let testCase = new TestCase(argv, testCaseName, testCaseFile, projectsDir, topProject, withNestedFolders, registry);
        if (testCase.skipExecution)
            return;
        testCases.push(testCase);
        testCasesMap[testCase.name] = testCase;
    }

    // Register test cases found in the directory
    module.registerTestCases = function () {
        if (argv.artIntegration) {
            if (fs.existsSync(argv.artIntegrationDir)) {
                fs.removeSync(argv.artIntegrationDir);
            }
            fs.mkdirSync(argv.artIntegrationDir);
            fs.cpSync(argv.testUtils, argv.artIntegrationDir + '/utils', { recursive: true });
        }
        else if (argv.artExport) {
            if (fs.existsSync(argv.artExportDir)) {
                fs.removeSync(argv.artExportDir);
            }
            fs.mkdirSync(argv.artExportDir);
        }

        logger.log('Collecting test cases in ' + argv.testDir + ' ...\n');
        let items = fs.readdirSync(argv.testDir, { withFileTypes: true });
        for (let item of items) {
            if (!item.isDirectory() || item.name.endsWith('_target') || item.name == 'TestRTSUtils')
                continue;

            if (argv.testCases && !argv.testCases.includes(item.name))
                continue; // Not included in the list of testcases to run

            // Look for testcase description file (in plain text or markdown)
            // Project with testcase description is the top project in the test
            let withNestedFolders = false;
            let testCaseFolder = argv.testDir + '/' + item.name;
            for (let ff of fs.readdirSync(testCaseFolder, { withFileTypes: true })) {
                if (isTestCaseDescriptionFile(ff)) {
                    addTestCase(argv.testDir, item.name, ff.name, item.name, false, this);
                    continue;
                }
                if (!ff.isDirectory() || ff.name.endsWith('_target'))
                    continue;
                let subFolder = testCaseFolder + '/' + ff.name;
                for (let ff2 of fs.readdirSync(subFolder, { withFileTypes: true })) {
                    if (isTestCaseDescriptionFile(ff2)) {
                        addTestCase(testCaseFolder, item.name, ff2.name, ff.name, true, this);
                        withNestedFolders = true;
                    }
                }
                if (withNestedFolders)
                    break;
            }
        }
        logger.logSeparator();
        logger.log(testCases.length + " testcases found in " + argv.testDir);
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
