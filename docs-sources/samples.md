The {$product.name$} [Git repository](https://github.com/secure-dev-ops/code-realtime/tree/main/art-samples) contains several sample applications. You can use them for learning about various features of the [Art language](art-lang/index.md) and the APIs provided by the [TargetRTS](target-rts/index.md). You can also use them as a starting point for creating your own applications with {$product.name$}.

The samples are listed here in an order that may be appropriate when learning to use {$product.name$}, starting with the simplest examples and proceeding with more advanced ones. For each sample, Art language constructs and TargetRTS APIs that it uses, are listed, so you can find the sample that shows what you currently want to learn more about. To keep these lists short, we only list what is new in the sample compared to previously mentioned samples.

## [HelloWorld]({$vars.github.repo$}/tree/main/art-samples/HelloWorld)
The most classical of samples for learning a new programming language. This version prints "Hello World!" on the console after a short delay, implemented by means of a timer. Watch [this video](https://youtu.be/TGpCqA63MxQ) to see how the sample was created.

**Art:** [capsule](art-lang/index.md#capsule), [state machine](art-lang/index.md#state-machine), [initial transition](art-lang/index.md#initial-transition), [state](art-lang/index.md#state), timer [port](art-lang/index.md#port), triggered [transition](art-lang/index.md#transition), [embedded C++ code](art-lang/index.md#embedded-c-code)

**TargetRTS:** [RTTiming](targetrts-api/class_timing_1_1_base.html)::informIn(), [RTController](targetrts-api/class_r_t_controller.html)::abort()

## [PingPong]({$vars.github.repo$}/tree/main/art-samples/PingPong)
Two capsules, `Pinger` and `Ponger`, send the events `ping` and `pong` back and forth. The `ping` event has an integer parameter which gets incremented by one for each ping-pong round. The sample prints messages to stdout both using standard C++ code and with the [Log service](target-rts/logging.md) of the TargetRTS.

**Art:** fixed [part](art-lang/index.md#part), [connector](art-lang/index.md#connector), service and behavior [port](art-lang/index.md#port), [protocol and event](art-lang/index.md#protocol-and-event), log [port](art-lang/index.md#port)

**TargetRTS:** [RTOutSignal](targetrts-api/struct_r_t_out_signal.html)::send(), [Log](targetrts-api/struct_log.html)::log(), [Log](targetrts-api/struct_log.html)::show(), [Log](targetrts-api/struct_log.html)::commit()

## [PingPongTimeDeltaTracker]({$vars.github.repo$}/tree/main/art-samples/PingPongTimeDeltaTracker)
While the standard [PingPong sample](#pingpong) runs forever, this version lets the user enter the number of ping-pong rounds at start-up. When the rounds are completed, information about how long it took is printed.

**Art:** [choice](art-lang/index.md#choice-and-junction), [entry action](art-lang/index.md#entry-and-exit-action), [transition guard](art-lang/index.md#transition)

**TargetRTS:** [RTTimespec](targetrts-api/struct_r_t_timespec.html)::getclock()

## [PiComputer]({$vars.github.repo$}/tree/main/art-samples/PiComputer)
This application computes a value of Pi using [Madhava](https://en.wikipedia.org/wiki/Madhava_of_Sangamagrama)'s formula, which consists of a series of additions and multiplications. The result is obtained as a collaboration of three capsules, each with a simple state machine, which coordinate their work by sending events with parameters.

**Art:** [composite state](art-lang/index.md#hierarchical-state-machine) (hierarchical state machine)

## [TrafficLight]({$vars.github.repo$}/tree/main/art-samples/TrafficLight)
This sample implements a classical traffic light that switches between red, yellow and green based on a periodic timer. The actual traffic light is implemented by means of a class `Light` with a state machine. An instance of that class is managed by the `TrafficLight` capsule. The `Light` class uses an interface class `ILogger`, which the `TrafficLight` capsules implements, for logging messages when the traffic light switches state. It delegates the work of logging to a separate Logger capsule. Note that only the `ILogger` interface is provided to the `Light` object, instead of the whole `TrafficLight` capsule which has an unnecessary big API for the needs of the `Light`.

**Art:** [class with state machine](art-lang/index.md#class-with-state-machine) 

**TargetRTS:** [RTTiming](targetrts-api/class_timing_1_1_base.html)::informEvery()

## [DiningPhilosophers]({$vars.github.repo$}/tree/main/art-samples/DiningPhilosophers)
Two different implementations of the classical [Dining Philosophers problem](https://en.wikipedia.org/wiki/Dining_philosophers_problem). The applications implement 3 different strategies (represented by an enum) for how to let all philosophers eat and think without causing a deadlock.

Version 1 of the sample uses fixed parts which are incarnated statically. The strategy to use is hard-coded into the application.

Version 2 of the sample uses optional parts which are incarnated dynamically, and with initialization data passed to the initial transition of the capsule state machine. The strategy to use is read as input from the command-line.

**Art:** initialization data passed to the [initial transition](art-lang/index.md#initial-transition), [automatically generated type descriptor](art-lang/cpp-extensions.md#automatically-generated)

**TargetRTS:** [RTActor](targetrts-api/class_r_t_actor.html)::getName(), [RTMessage](targetrts-api/class_r_t_message.html)::sap(), [Frame](targetrts-api/class_frame_1_1_base.html)::incarnate()

## [MoreOrLess]({$vars.github.repo$}/tree/main/art-samples/MoreOrLess)
A "guess-the-secret-number" game which illustrates the use of plugin capsule parts.

**Art:** [plugin part](art-lang/index.md#plugin_part)

**TargetRTS:** [Frame](targetrts-api/class_frame_1_1_base.html)::import(), [Frame](targetrts-api/class_frame_1_1_base.html)::deport()

## [DependencyInjection]({$vars.github.repo$}/tree/main/art-samples/DependencyInjection)
This sample shows how to use [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) to customize capsule incarnation. Build variants are used for configuring how to customize the dependency injection, which will influence on how the application behaves.

**Art:** [capsule inheritance](art-lang/index.md#capsule-inheritance), [capsule factory](target-rts/capsule-factory.md), [dependency injection](target-rts/dependency-injection.md), [build variants](building/build-variants.md)

**TargetRTS:** [RTInjector](targetrts-api/class_r_t_injector.html), [RTActorFactoryInterface](targetrts-api/class_r_t_actor_factory_interface.html)

## [QtTrafficLight]({$vars.github.repo$}/tree/main/art-samples/QtTrafficLight)
This application has a user interface developed with [Qt](https://www.qt.io/) which controls a realtime application that implements the logic of a traffic light that works together with a pedestrian light. Note that you need to have [Qt](https://www.qt.io/) installed to build and run this sample.

**Art:** [composite state with entry- and exitpoint](art-lang/index.md#hierarchical-state-machine), [external port](target-rts/integrate-with-external-code.md#external-port), [notifying port](art-lang/index.md#notifying-port), [internal transition](art-lang/index.md#internal-transition)

**TargetRTS:** [RTTiming](targetrts-api/class_timing_1_1_base.html)::cancelTimer()

## [TrafficLightWeb]({$vars.github.repo$}/tree/main/art-samples/TrafficLightWeb)
This sample is similar to [QtTrafficLight](#qttrafficlight) but the user interface is instead implemented as a Node.js web application. The application uses the [TCPServer library]({$vars.github.repo$}/tree/main/art-samples/TcpServer) and the Node.js application therefore can use the [rt-tcp-utils](https://www.npmjs.com/package/rt-tcp-utils) library for communicating with it. Communication between the Node.js application and the web page uses [socket.io](https://socket.io/).

**Art:** [junction point](art-lang/index.md#choice-and-junction)

**TargetRTS:** Extracting command-line arguments by means of [RTMain](targetrts-api/class_r_t_main.html)::argCount() and [RTMain](targetrts-api/class_r_t_main.html)::argStrings()

## [TcpRangeCounter]({$vars.github.repo$}/tree/main/art-samples/TcpRangeCounter)
This sample uses the [TCPServer library]({$vars.github.repo$}/tree/main/art-samples/TcpServer) which makes it possible to communicate with the application from the "outside" by means of making TCP requests. Two sample client applications for making such requests are included:

* [A command-line Node.js client]({$vars.github.repo$}/tree/main/art-samples/TcpRangeCounter/client)
* [A Node.js Express web application]({$vars.github.repo$}/tree/main/art-samples/TcpRangeCounter/client-ui)

The sample also shows how to run a capsule instance in its own [thread](target-rts/threads.md).

**Art:** [capsule constructor](art-lang/index.md#capsule-constructor)

**TargetRTS:** [Frame](targetrts-api/class_frame_1_1_base.html)::incarnateCustom()

## [DistributedPingPong]({$vars.github.repo$}/tree/main/art-samples/DistributedPingPong)
This sample uses the [TCPServer library]({$vars.github.repo$}/tree/main/art-samples/TcpServer) for implementing a distributed application. Two instances of the PingPong application are launched and the TCPServer library ensures that the events that are sent out by one application, are serialized to JSON, sent over TCP and received by the other application. The applications are connected by means of command-line arguments that specify the application's own port, and the port of the other application.

To start the communication, a special command-line argument `-injectFirstPing` is supported. The implementation of this argument uses APIs of [RTMessage](targetrts-api/class_r_t_message.html) for programmatically injecting an event on a port.

**Art:** [timer data](target-rts/timers.md#timer-data), [symmetric events](art-lang/index.md#protocol-and-event), [calling code from an inherited transition](art-lang/index.md#calling-code-from-an-inherited-transition)

**TargetRTS:** [RTMain](targetrts-api/class_r_t_main.html)::argCount(), [RTMain](targetrts-api/class_r_t_main.html)::argStrings(), [RTMemoryUtil](targetrts-api/class_r_t_memory_util.html), [RTMessage](targetrts-api/class_r_t_message.html), [RTController](targetrts-api/class_r_t_controller.html)::receive()

## [TokenRing]({$vars.github.repo$}/tree/main/art-samples/TokenRing)
This sample is similar to [DistributedPingPong](#distributedpingpong), and also uses the [TCPServer library]({$vars.github.repo$}/tree/main/art-samples/TcpServer). But instead of just connecting two applications, here multiple applications can be connected in a ring structure. The applications exchange a `token` event which has a string (`RTString`) data parameter.

**TargetRTS:** [RTString](targetrts-api/class_r_t_string.html)

## [gRPC_MazeRunner]({$vars.github.repo$}/tree/main/art-samples/gRPC_MazeRunner)
This sample uses the [gRPCServer library]({$vars.github.repo$}/tree/main/art-samples/gRPCServer) which allows a realtime application to communicate using [gRPC](https://grpc.io/) with other applications. The sample also shows how to mix Art files with [hand-written C++ source files](building/build-cpp-files.md) and build them into a single application.

**TargetRTS:** [RTOutSignal](targetrts-api/struct_r_t_out_signal.html)::invoke()
