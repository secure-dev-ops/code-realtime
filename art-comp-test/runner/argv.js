const yargs = require('yargs');
const fs = require('fs-extra');
const logger = require('./logger');
const path = require('path');

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
        description: 'Path to the Java VM to use for the model compiler and Art compiler.',
        type: 'string',
        default: process.env.JAVA_HOME ? process.env.JAVA_HOME + '/bin/java' : 'java'
    })    
    .option('installDir', {                
        description: 'Directory where Model/Code RealTime is installed. For Model RealTime specify the location to the "eclipse" directory. For Code RealTime specify the extension root folder.',
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
        default: process.platform == 'win32' ? 'WinT.x64-MinGw-12.2.0' : process.platform == 'linux' ? 'LinuxT.x64-gcc-12.x' : process.arch == 'arm64' ? 'MacT.AArch64-Clang-15.x' : 'MacT.x64-Clang-14.x'
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
        default: 60,
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
    .option('artIntegration', {
        description: 'Determines if this has to run art integration tests.'
    })
    .option('artExport', {
        description: 'Determines if this has to run art export tests.'
    })
    .help()
    .alias('help', 'h')
    .check((argv, options) => {
        return true;
    })
    .argv;    

if (argv.testCases) {
    argv.testCases = argv.testCases.split(',');
}

// Model Compiler: --installDir points to eclipse ==> argv.modelCompilerJar
// Art Compiler: --installDir points to rtistic/extension/secure-dev-ops.code-realtime-* ==> argv.artCompilerJar
// Art Exporter: --modelCompilerJar, --artCompilerJar, --artExport; calling 1) ModelCompiler 2) ArtCompiler
// Art Integration: --modelCompilerJar, --artCompilerJar, --artIntegration; calling ModelCompiler with -DART_COMPILER

logger.logSeparator();
logger.log("JAVA_HOME         = " + process.env.JAVA_HOME);
argv.javaVM = argv.javaVM.replace('\\', '/');
logger.log("javaVM            = " + argv.javaVM);
logger.log("targetConfig      = " + argv.targetConfig);
argv.testDir = path.resolve(argv.testDir).split(path.sep).join('/');
logger.log("testDir           = " + argv.testDir);
argv.runnerDir = __dirname.split(path.sep).join('/');
logger.log("runnerDir         = " + argv.runnerDir);
// utils folder is next to runner
argv.testUtils = path.resolve(argv.runnerDir, '../utils').split(path.sep).join('/');
logger.log("testUtils         = " + argv.testUtils);
argv.buildVariants = argv.testUtils + '/testVariants.js';
logger.log("buildVariants     = " + argv.buildVariants);

if (argv.installDir) {
    argv.installDir = argv.installDir.replace('\\', '/');
    logger.log("installDir        = " + argv.installDir);
    if (!argv.artCompilerJar) {
        // Check if this is Code RealTime installation
        let artCompilerPath = argv.installDir + '/bin/artcompiler.jar';
        if (fs.existsSync(artCompilerPath)) {
            argv.artCompilerJar = artCompilerPath;
        }
    }
    if (!argv.modelCompilerJar) {
        // Check if this is Model RealTime installation
        let modelCompilerPath = argv.installDir + '/rsa_rt/tools/modelcompiler.jar';
        if (fs.existsSync(modelCompilerPath)) {
            argv.modelCompilerJar = modelCompilerPath;
            if (!argv.rsaRTHome) argv.rsaRTHome = argv.installDir + '/rsa_rt';
        }
    }
    if (!argv.targetRTSDir) {
        // Compute TargetRTS folder based on install location
        let targetRTSPath = argv.installDir + '/rsa_rt/C++/TargetRTS';
        if (fs.existsSync(targetRTSPath)) {
            argv.targetRTSDir = targetRTSPath;
            if (!argv.rsaRTHome) argv.rsaRTHome = argv.installDir + '/rsa_rt';
        } else {
            targetRTSPath = argv.installDir + '/TargetRTS';
            if (fs.existsSync(targetRTSPath)) {
                argv.targetRTSDir = targetRTSPath;
            }
        }
    }
}

if (argv.artIntegration || argv.artExport) {
    if (!argv.modelCompilerJar || !argv.artCompilerJar) {
        logger.log("\nERROR: Both Model Compiler and Art Compiler (--artCompilerJar) must be provided for Art " +
            (argv.artExport ? "exporter" : "integration") + " testing");
        process.exit(1);
    }
    argv.isModelCompiler = argv.artIntegration ? true : false;
} else {
    if (!argv.modelCompilerJar && !argv.artCompilerJar) {
        logger.log("\nERROR: At least one of --installDir or --modelCompilerJar or --artCompilerJar must be specified");
        process.exit(1);
    }
    argv.isModelCompiler = argv.artCompilerJar ? false : true;
}

if (!argv.rsaRTHome && argv.isModelCompiler && argv.targetRTSDir) {
    let d = argv.targetRTSDir.split('/');
    if (d.length < 2) {
        logger.log('\nERROR: Specified TargetRTS directory is invalid. It must conform to the pattern */C++/TargetRTS');
        process.exit(1);
    }
    d.pop();
    d.pop();
    argv.rsaRTHome = d.join('/');
}
if (argv.rsaRTHome) logger.log("RSA_RT_HOME       = " + argv.rsaRTHome);

let testContainerPath = path.resolve(argv.testDir, '..').split(path.sep).join('/');
if (argv.artExport) {
    argv.artExportDir = testContainerPath + '/artExportProjects';
    logger.log("artExportDir      = " + argv.artExportDir);
}
let codeWorkspace = testContainerPath + '/art-comp-test.code-workspace';
if (fs.existsSync(codeWorkspace)) {
    argv.codeWorkspace = codeWorkspace;
    logger.log("codeWorkspace     = " + argv.codeWorkspace);
}
if (argv.artIntegration) {
    argv.artIntegrationDir = testContainerPath + '/artIntegrationTests';
    logger.log("artIntegrationDir = " + argv.artIntegrationDir);
    argv.modelRTTemplate = testContainerPath + '/testTemplates';
    logger.log("modelRTTemplate   = " + argv.modelRTTemplate);
}

if (argv.artCompilerJar) {
    argv.artCompilerJar = argv.artCompilerJar.replace('\\', '/');
    logger.log("artCompilerJar    = " + argv.artCompilerJar);
}
if (argv.modelCompilerJar) {
    argv.modelCompilerJar = argv.modelCompilerJar.replace('\\', '/');
    logger.log("modelCompilerJar  = " + argv.modelCompilerJar);
    if (argv.licenseArg) {
        logger.log("licenseArg        = " + argv.licenseArg);
    } else if (process.env.RUNNER_LICENSE_ARG) {
        argv.licenseArg = process.env.RUNNER_LICENSE_ARG;
    }
}
if (argv.targetRTSDir) {
    argv.targetRTSDir = argv.targetRTSDir.replace('\\', '/');
    logger.log("targetRTSDir      = " + argv.targetRTSDir);
}

argv.compilerName = argv.isModelCompiler ? "Model Compiler" : "Art Compiler"; 
logger.log("compilerName      = " + argv.compilerName);

module.exports = argv;
