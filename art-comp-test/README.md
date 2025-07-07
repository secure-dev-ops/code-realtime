# Running tests from command line
Test cases are under [tests](tests/), testing scripts are under [runner](runner/), `TestUtils` Art project is [here](utils/TestUtils/). Testing scripts are using [testVariants.js](utils/testVariants.js) for configuring target platform on the fly with [targetPlatform.js](utils/targetPlatform.js).

Before first execution, install Node.js dependencies:
```sh
ART_COMP_TEST=$RT_TESTAREA/git/rtistic-pub-doc/art-comp-test
TEST_RUNNER=$ART_COMP_TEST/runner

cd $TEST_RUNNER
npm install
```

## Art Compiler testing
```sh
ART_COMP_TEST=$RT_TESTAREA/git/rtistic-pub-doc/art-comp-test
TEST_RUNNER=$ART_COMP_TEST/runner

cd $ART_COMP_TEST
node $TEST_RUNNER/app.js --testDir=tests --installDir $RT_INSTALL_BASE/VSCode/data/extensions/secure-dev-ops.code-realtime-* --testSuiteName "Art Compiler" --port=4444
```

## Art integration testing
Art integration test chain is using executable test cases from Art Compiler test base under [tests](tests/).

```sh
ART_COMP_TEST=$RT_TESTAREA/git/rtistic-pub-doc/art-comp-test
TEST_RUNNER=$ART_COMP_TEST/runner

MC_TEST_VERSION=IBM_MODELRT_12.1_3_20250617_0757 # ModelRT installation folder

cd $ART_COMP_TEST
node $TEST_RUNNER/app.js --testDir=tests --installDir $RT_INSTALL_BASE/$MC_TEST_VERSION --artIntegration --artCompilerJar $RT_INSTALL_BASE/VSCode/data/extensions/secure-dev-ops.code-realtime-*/bin/artcompiler.jar --testSuiteName "Art Integration $MC_TEST_VERSION" --port=4444
```

## Running individual test cases
Add `--testCases` argument with comma-separated list of test case names:
```sh
--testCases=abstract_capsule
```
