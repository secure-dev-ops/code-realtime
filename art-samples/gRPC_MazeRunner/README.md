# gRPCServer Sample
This sample shows how to use the [grpcServer library](../gRPCServer/README.md). It implements a maze, consisting of a state machine, which can be walked by sending commands from a client application. The [client application](https://github.com/HCL-TECH-SOFTWARE/lib-grpc-server/blob/main/grpc-client) is implemented as a C++ command-line application.

## Building
Before building the server you should build the client application. Follow [these instructions](https://github.com/HCL-TECH-SOFTWARE/lib-grpc-server/blob/main/README.md#build-the-client).

Build then the server using the TC [server_win.tcjs](server_win.tcjs). It's configured to use Visual Studio 17 (2022) for Win64 Debug. With its default settings it requires a TargetRTS that also has been built with debug symbols. Follow [these steps](https://model-realtime.hcldoc.com/help/topic/com.ibm.xtools.rsarte.webdoc/Articles/Running%20and%20debugging/Debugging%20the%20RT%20services%20library.html?cp=23_2_13_1). In addition, set the `/MDd` flag in `LIBSETCCFLAGS` when editing `libset.mk` before building it (to use the debug version of C run-time library).

Before you build [server_win.tcjs](server_win.tcjs) edit the variables in the beginning of the file that specify the location where you placed the gRPC source code (`grpcSourceLocation`) and where you installed the gRPC tools and libraries (`grpcInstallLocation`). Also specify the path to where the sample application is located (`clientBuildLocation`). Also edit the `targetRTSLocation` property to specify the path to the TargetRTS to use. Other properties that have to be modified depending on if you want to debug or not (and which compiler that is used) are `compileArguments` and `linkArguments`. By default they are set so you can debug with Visual Studio.

## Running
Follow [these instructions](#https://github.com/HCL-TECH-SOFTWARE/lib-grpc-server/blob/main/README.md#run-the-sample) for how to run the server and client applications. 

How the sample works is explained [here](https://github.com/HCL-TECH-SOFTWARE/lib-grpc-server/blob/main/README.md#how-the-sample-works).

## Editing
This sample makes use of several C++ source files located in the `include` and `src` folder. For the best editing experience, the C++ extension needs to be configured with settings that enable it to correctly parse these files. Refer to [the documentation](https://secure-dev-ops.github.io/code-realtime/building/build-cpp-files/#c-extension-source-code-analysis) for information how to do this. The sample configuration file `compile_commands.json` for the Clangd extension shows how to do this for one of the C++ source files (replace the paths to match the paths used in the TC).