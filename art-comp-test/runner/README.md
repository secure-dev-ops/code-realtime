# Test Runner
This Node.js script runs the tests in `../tests` (or a similar folder with test cases). 
It can be run either as a non-interactive batch script for example suitable when invoked from CI/CD tools such as Jenkins or DevOps Deploy. 
Or it can be invoked in an "interactive" mode where it provides a web page that shows the result of running the tests, let's you inspect log files or manually re-run an individual test case.

There are two main usecases for when this script can help you:
* You have created your custom version of the TargetRTS and want to ensure your changes have not broken any existing functionality. This usecase applies for both Code RealTime and Model RealTime users.
* You want to implement regression testing for Art applications and libraries that you have implemented in Code RealTime. This usecase mainly applies for Code RealTime users, but also for Model RealTime users that use libraries developed with Code RealTime.

## Preparation
Before you can use the script perform these steps:
1. Make sure you have [Code RealTime](https://secure-dev-ops.github.io/code-realtime) installed.
2. Make sure you have a recent version of [Node.js](https://nodejs.org/en/download) installed.
3. Make sure you have required C++ build tools available in the path. If you are unsure, test by building a TC in Code RealTime or Model RealTime for your desired target configuration. If it works, you should be good to go.
4. Open this `runner` folder in a terminal, and install the dependencies of the script

```shell
npm install
```

## Running Tests
To run the script:

```shell
node app.js <arguments>
```

The script accepts a number of command-line arguments, which you can see if you invoke it with `--help`. However, many of these arguments are optional and/or reserved for internal use only. Only those arguments that you need to use are described below. At a minimum you need to provide the following arguments:

* `--testDir` Specifies the location of the tests to run. If you are in the `runner` folder and want to use the tests in `tests` pass it as `--testDir=../tests`.
* `--javaVM` Specifies the location of the Java VM to use for running the Art Compiler. For example `--javaVM=C:/openjdk/jdk-21.0.4.7-hotspot/bin/java`.
* `--artCompilerJar` Specifies the location of the Art Compiler JAR file. For example `C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/bin/artcompiler.jar`.
* `--targetRTSDir` Specifies the location of the TargetRTS to use. Here you can either point at your custom version of the TargetRTS or the one that is in the Code RealTime or Model RealTime installation (depending on your usecase). For example: `--targetRTSDir=C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/TargetRTS`.
* `--targetConfig` Specifies the target configuration (must be available in the specified TargetRTS) to use. For example `--targetConfig=WinT.x64-MinGw-12.2.0`.

With the above arguments the script will run all tests and print the results in the console.

If you pass the argument `--port` the script will start a web server which you can access from a web browser on the specified port. For example, passing `--port=4444` makes the web server available at `http://localhost:4444/`.
By default the web server is only running while the tests execute, but you can pass `--terminateWebServer==never` if you want it to keep running also after test execution is completed. `--terminateWebServer==ifNoFailures` is another alternative in case the web server only should keep running in case one or more tests failed.

Here is an example of a complete command-line that runs the script in interactive mode by starting a web server:

```shell
node app.js --targetConfig=WinT.x64-MinGw-12.2.0 --testDir=../tests --javaVM=C:/openjdk/jdk-21.0.4.7-hotspot/bin/java --artCompilerJar=C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/bin/artcompiler.jar --targetRTSDir=C:/VSCode/data/extensions/secure-dev-ops.code-realtime-ce-2.0.8/TargetRTS --port=4444
```

By default all tests in the specified test folder will execute, and they will execute in parallel groups to speed up the overall execution. You can limit execution to only some tests by means of the `--testCases` argument. Specify the names of tests to run (i.e. the folder names) separated by comma. If you have a powerful machine with lots of cores you can raise the `--maxParallel` option from the default 5 to a higher number. This controls how many tests are placed in each group that executes in parallel. Setting it to 1 disables parallel execution and all tests will then execute serially one after the other.
