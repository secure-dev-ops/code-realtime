const fs = require('fs-extra');
const os = require('os');
const readline = require('readline');
const logger = require('./logger');

const COMPARE_DISTANCE = 13;


module.exports = function(argv) {   
    let module = {};
    
    function compareFile(compareInfo) {
        return new Promise((resolve, reject) => {
            let filePath = compareInfo.filePath;
            let lines = compareInfo.lines;
            compareInfo.log = '';

            let msg = 'Comparing ' + filePath + ' ...';
            logger.log(msg);
            console.log(lines);
            compareInfo.log += os.EOL + msg + os.EOL;

            if (!fs.existsSync(filePath)) {
                msg = 'ERROR: File for comparison does not exist: ' + filePath;
                logger.log(msg);
                compareInfo.verdict = false;
                compareInfo.log += msg + os.EOL;
                resolve(false);
                return;
            }

            const readInterface = readline.createInterface({
                input: fs.createReadStream(filePath),
                output: false,
                console: false
            });
            
            let lineNumber = 0;
            let verdict = true;
			let lineNumbers = Object.keys(lines);
			let compareWindow = [];
			let compareWindowStart = 0;

			let matchInCompareWindow = function() {
				if (lineNumbers.length == 0)
					return;
				let toMatchLineNumber = Number(lineNumbers[0]);
				let toMatch = lines[toMatchLineNumber];
				let matched = 0;
				for (let i = 0; i < compareWindow.length; i++) {
					let distance = ( compareWindowStart + i ) - toMatchLineNumber;
					if (compareWindow[i] == toMatch) {
						msg = 'OK: ' + toMatchLineNumber + '(' + (distance > 0 ? '+' : '') + distance + '): ' + toMatch;
						compareInfo.log += msg + os.EOL;
						matched = i+1;
						break;
					}
				}
				if (matched == 0) {
					msg = 'ERROR: ' + filePath + ' ' + toMatchLineNumber + ': match was not found:';
					logger.log(msg);
					compareInfo.log += msg + os.EOL;
					msg = '? ' + toMatchLineNumber + ': ' + toMatch;
					logger.log(msg);
					compareInfo.log += msg + os.EOL;
					for (let i = 0; i < compareWindow.length; i++) {
						msg = '- ' + (compareWindowStart + i) + ': ' + compareWindow[i];
						logger.log(msg);
						compareInfo.log += msg + os.EOL;
					}
                    verdict = false;
				}
				lineNumbers.shift();
				if (lineNumbers.length == 0)
					return;
				// First remove lines from compareWindow up to the matched line
				if (matched != 0) {
					compareWindow.splice(0, matched);
					compareWindowStart += matched;
				}
				// Check next line number to match, how many lines from current compare windows must be kept
				toMatchLineNumber = Number(lineNumbers[0]);
				if (compareWindowStart < (toMatchLineNumber - COMPARE_DISTANCE)) {
					let removeCount = toMatchLineNumber - COMPARE_DISTANCE - compareWindowStart;
					compareWindow.splice(0, removeCount);
					compareWindowStart += removeCount;
				}
			};

            readInterface.on('line', function(line) {
                if (lineNumbers.length == 0) {
                    compareInfo.verdict = verdict;
                    resolve(verdict);
                    return;
                }

                lineNumber++;
				let toMatchLineNumber = Number(lineNumbers[0]);
				if (lineNumber < (toMatchLineNumber - COMPARE_DISTANCE)) {
					return;
				}
				if (lineNumber < (toMatchLineNumber + COMPARE_DISTANCE)) {
					if (compareWindow.length == 0)
						compareWindowStart = lineNumber;
					compareWindow.push(line.trim());
					return;
				}

				compareWindow.push(line.trim());

				matchInCompareWindow();

            });

            readInterface.on('close', function() {
				while (lineNumbers.length > 0 && compareWindow.length > 0) {
					matchInCompareWindow();
				}
				if (lineNumbers.length > 0) {
					msg = 'ERROR: ' + filePath + ' ' + lineNumbers[0] + ': one or more matches were not found: ' + lines[lineNumbers[0]];
                    logger.log(msg);
                    compareInfo.log += msg + os.EOL;
					verdict = false;
				}
                compareInfo.verdict = verdict;
                resolve(verdict);
            });
        });
    }
    
    module.compareGeneratedFiles = function(testCase, onCompleted) {
        if (testCase.compareInfo.length == 0) {
            onCompleted(true);
            return;
        }

        let msg = 'Comparing generated code';
        testCase.setState(msg);
        testCase.addToBuildLog(logger.heading(msg));
        Promise.all(testCase.compareInfo.map(compareFile)).finally(() => {
            let verdict = true;
            testCase.compareInfo.forEach(info => {
                testCase.addToBuildLog(info.log);
				if (info.verdict) {
					testCase.addToBuildLog('PASS : ' + info.filePath + os.EOL);
				} else {
					testCase.addToBuildLog('FAIL : ' + info.filePath + os.EOL);
					testCase.errorMsg += (verdict ? 'Generated files comparison failed for: ' : ', ') + info.filePath;
				}
                verdict = verdict && info.verdict;
            });
            onCompleted(verdict);
        });
    }

    return module;
}
