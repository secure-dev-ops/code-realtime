const yargs = require('yargs');
const glob = require('glob');
const fs = require('fs-extra');
const logger = require('./logger');

// Return the most recent of the folders (based on the timestamp in its)
function getMostRecentFromTimestamp(folders) {
    let newest = null;
    let result = null;
    for (let folder of folders) {
        let i = folder.lastIndexOf('.v');
        if (i == -1)
            continue;

        let date = new Date();
        date.setFullYear(folder.substring(i+2, i+6));
        date.setMonth(folder.substring(i+6, i+8) - 1);
        date.setDate(folder.substring(i+8, i+10));
        date.setHours(folder.substring(i+11, i+13));
        date.setMinutes(folder.substring(i+13, i+15));
        if (newest == null || date > newest) {
            newest = date;
            result = folder;
        }
    }
    return result;
}


const argv = yargs    
    .option('port', {
        description: 'Web server port. If omitted the web server will not be started.',
        type: 'number'
    })
    .option('hostname', {        
        default: 'localhost',
        description: 'Web server host name.',
        type: 'string'
    })
    .option('testDir', {    
        description: 'Directory where to look for testcases. This should be an Eclipse workspace containing testcase model projects.',
        type: 'string',
        demandOption: true
    })
    .option('testSuiteName', {    
        description: 'The name to use for this test suite run.',
        default: 'mc-executable',
        type: 'string'        
    })
    .option('javaVM', {                
        description: 'Path to the Java VM to use for the model compiler.',
        type: 'string',
        demandOption: true
    })    
    .option('installDir', {                
        description: 'Directory where RSARTE/RTist (in Code) is installed. For RSARTE/RTist specify the location to the "eclipse" directory. For RTist in Code specify the extension root folder.',
        type: 'string'
    })    
    .option('modelCompilerJar', {
        description: 'Full path to the model compiler JAR. If omitted the JAR file is taken from the RSARTE/RTist installation.',
        type: 'string'
    })
    .option('artCompilerJar', {
        description: 'Full path to the Art compiler JAR. If omitted the JAR file is taken from the RTist in Code installation.',
        type: 'string'
    })
    .option('targetRTSDir', {                
        description: 'Location of the TargetRTS to use. If omitted the TargetRTS specified in the testcase TC will be used (usually the TargetRTS from the RSARTE/RTist (in Code) installation).',
        type: 'string'        
    })    
    .option('targetConfig', {                
        description: 'Target configuration to use for building the test cases.',
        type: 'string',
        demandOption: true
    }) 
    .option('oldCpp', {
        description: 'Generate code compliant with older than C++ 11 standards.',
    })
    .option('licenseArg', {                
        description: 'Specifies the license argument for the model compiler.',
        type: 'string'
    }) 
    .option('testTimeout', {                
        description: 'The number of seconds to wait for a test executable to run to completion before aborting it (and considering it a failed test).',
        default: 600,
        type: 'number'
    }) 
    .option('maxParallel', {
        description: 'Maximum number of tests that will be executed in parallel.',
        default: 5,
        type: 'number'
    })
    .option('testCases', {                
        description: 'Comma-separated list of names of testcases to run. If omitted all testcases will be run.',
        type: 'string'
    }) 
    .option('terminateWebServer', {
        description: 'Determines when to terminate the web server after test execution.',
        default: 'never',
        choices: ['always', 'never', 'ifNoFailures']
    })
    .option('genXML', {
        description: 'Path to a JUnit-style XML file to generate containing the test results.',        
        type: 'string'
    })
    .option('artIntegration',{
        description:'Determines if this has to run art integration tests.'
    })
    .help()
    .alias('help', 'h')
    .check((argv, options) => {
        // Validate command-line arguments given
        if(argv.artIntegration && (!argv.modelCompilerJar || !argv.artCompilerJar || !argv.targetRTSDir )){
            throw new Error("If --artIntegration is specified then --modelCompilerJar, --artCompilerJar and --targetRTSDir must also be specified. ")
        }

        if (!argv.installDir && !argv.modelCompilerJar && !argv.artCompilerJar) {
            throw new Error("At least one of --installDir or --modelCompilerJar or --artCompilerJar must be specified.");
        }
        if ((argv.modelCompilerJar || argv.artCompilerJar) && !argv.targetRTSDir) {
            throw new Error("If --modelCompilerJar or --artCompilerJar is specified then --targetRTSDir must also be specified.");
        }
        
        return true;
    })
    .argv;    

    if (argv.testCases) {
        argv.testCases = argv.testCases.split(',');
    }

    if (!argv.modelCompilerJar && !argv.artCompilerJar) {
        // Set the path to the Model compiler or Art compiler JAR file based on the specified installDir
        let artCompilerPath = argv.installDir + '/bin/artcompiler.jar';
        if (fs.existsSync(artCompilerPath)) {
            // RTist in Code installation
            argv.artCompilerJar = artCompilerPath;
        }       
        else {
            // RSARTE/RTist installation
            let paths = glob.sync("com.ibm.xtools.umldt.rt.core.tools_*", {"cwd" : argv.installDir + '/plugins'});
            if (paths.length == 1) {
                argv.modelCompilerJar = argv.installDir + '/plugins/' + paths[0] + '/tools/modelcompiler.jar';
            }
            else if (paths.length > 0) {
                // Can happen if multiple versions of RSARTE/RTist have been installed into the same Eclipse.
                // We then should pick the most recent
                argv.modelCompilerJar = argv.installDir + '/plugins/' + getMostRecentFromTimestamp(paths) + '/tools/modelcompiler.jar';
            }
            if (paths.length == 0 || !fs.existsSync(argv.modelCompilerJar)) {
                logger.log('Could not find the model compiler JAR file in the RSARTE/RTist installation specified with --installDir');
                process.exit();
            }
        }        
    }
    
    argv.compilerJar = argv.modelCompilerJar ? argv.modelCompilerJar : argv.artCompilerJar; 
    argv.compilerName = argv.modelCompilerJar ? "Model Compiler" : "Art Compiler"; 

module.exports = argv;
