# gRPCServer Library
A library for [DevOps Code RealTime](https://secure-dev-ops.github.io/code-realtime) which allows a realtime application to communicate using [gRPC](https://grpc.io/) with other applications. You can:

* make incoming asynchronous requests with or without data
* make incoming synchronous requests with reply data
* subscribing (and unsubscribing) to get notified about events sent out from by the realtime application

## Using the Library
The library is ported from [this Model RealTime library](https://github.com/HCL-TECH-SOFTWARE/lib-grpc-server). Follow the instructions there under [Preparations](https://github.com/HCL-TECH-SOFTWARE/lib-grpc-server?tab=readme-ov-file#preparations) before building the library.

## Building the Library
To make use of this library add the TC [grpcServerLib.tcjs](grpcServerLib.tcjs) as a prerequisite of the executable TC for your Code RealTime application.

Note that the TC [grpcServerLib.tcjs](grpcServerLib.tcjs) is designed to be built only as a prerequisite of an executable TC. It will automatically reuse some of the TC properties from the top executable by calling `TCF.getTopTC()`. Here is an example of such a TC property:

`
tc.targetRTSLocation = TCF.getTopTC().eval.targetRTSLocation;
`

For an example of using the library in a Code RealTime application, see the [MazeRunner sample](../gRPC_MazeRunner/README.md). 
