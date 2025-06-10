const { create } = require('xmlbuilder2');
const fs = require('fs-extra');
const logger = require('./logger');

// Generator of JUnit XML files
let XMLGenerator = {};    

function escapeXML(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Writes information from the test case registry into the specified XML file
XMLGenerator.writeXML = function(testCaseRegistry, argv, testTimer) {
    let root = create({ version: '1.0',  encoding: 'UTF-8' });
    let testSuite = root.ele('testsuite', { 
        name: testCaseRegistry.getTestSuiteName(),         
        tests: testCaseRegistry.getTestCases().length, 
        failures: testCaseRegistry.getFailedTests().length, 
        hostname: argv.hostname,
        time : testTimer.getTotalTimeSec(),
        timestamp : testTimer.getStarted().toISOString()
    });
    for (let testCase of testCaseRegistry.getTestCases()) {
        let tc = testSuite.ele('testcase', {
            name: testCase.name,
            classname: testCaseRegistry.getTestSuiteName() + '.' + testCase.group,
            status: testCase.state,
            time: testCase.getTimeSpent()
        });
        
		let textDescription = testCase.description.replace(/<[^>]*>/g, '');
		textDescription = textDescription.replace(/(^\s*|\s)(RSARTE-|WI\s)?([0-9][0-9][0-9][0-9][0-9][0-9]?)[:.]?(\s)/g, '$1https://jira01.hclpnp.com/browse/RSARTE-$3$4');
		if ( Object.keys(testCase.compilerOutput).length > 0 ) {
			textDescription += '\n' + argv.compilerName + ' output must contain:\n';
			for (var key in testCase.compilerOutput) {
				textDescription += testCase.compilerOutput[key] + '\n';
			}
		}
		if (testCase.compareInfo.length > 0) {
			textDescription += '\nCompare generated files:\n';
			testCase.compareInfo.forEach(info => {
				textDescription += (info.verdict ? 'PASS: ' : 'FAIL: ') + info.filePath + '\n';
			});
		}

        if (testCase.hasFailed()) {
            tc.ele('failure', {
                message: testCase.errorMsg,
                type: testCase.errorType
            });
			if (testCase.errorType.startsWith('execute')) {
                tc.ele('system-out').dat(textDescription + '\n' + testCase.testLogStdOut);
                tc.ele('system-err').dat(testCase.testLogStdErr);
			} else {
				tc.ele('system-out').dat(textDescription);
                tc.ele('system-err').dat(testCase.buildLog);
			}
        } else {
			if (testCase.doExecute && !testCase.testExeExpectPASSstdout) {
				tc.ele('system-out').dat(textDescription + '\n' + testCase.testLogStdOut);
				tc.ele('system-err').dat(testCase.testLogStdErr);
			} else {
				tc.ele('system-out').dat(textDescription);
			}
		}
	}

    const xml = root.end({ prettyPrint: true });
    try {
        fs.writeFileSync(argv.genXML, xml, "utf8");        
    }
    catch (err) {
        logger.log('Failed to write XML file: ' + argv.genXML);
    }
}
    
module.exports = XMLGenerator;
