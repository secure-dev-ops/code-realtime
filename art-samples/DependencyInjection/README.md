# Dependency Injection Sample with Build Variants using Art Compiler

You can build the Dependency Injection sample with build variants using the Art Compiler.

## Art Compiler Setup

Visit [Building from Art Compiler](https://secure-dev-ops.github.io/code-realtime/building/art-compiler) for instructions on setting up the Art Compiler.

## Build Command

```shell
java -jar PATH_TO_VSCODE\.vscode\extensions\secure-dev-ops.code-realtime-1.0.1\bin\artcompiler.jar --tc PATH_TO_DEPENDENCY_INJECTION_FOLDER/top.tcjs --out C:/temp --buildVariants PATH_TO_DEPENDENCY_INJECTION_FOLDER/build_variants.js --buildConfig="Pinger = Fast; Logger = With timestamps"
```


Ensure to replace PATH_TO_VSCODE, PATH_TO_DEPENDENCY_INJECTION_FOLDER with the appropriate paths in your system.

Supported build configurations from build_variants.js are:

Pinger = Fast | Slow
Logger = With timestamps | Without timestamps
Feel free to adjust the build configuration as needed for your project.



On Successful build completion
Locate the Top.exe file, typically found at: (--out C:/temp/)
C:/temp/dependency_injection/default

# Run project 
Run the project using the following command:

```shell
 ./Top.EXE -URTS_DEBUG=quit 
 ```

**Ensure you clean the project whenever you change the --buildConfig to reflect the configuration changes:**

```shell
make clean
```