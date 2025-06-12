By default, any application that you build with {$product.name$} will include a small command-line module known as the **Run Time System Debugger** (RTS Debugger). If you run your application without any command-line arguments, the RTS Debugger will start. For example:

```shell
> .\Top.EXE            
RT C++ Target Run Time System - Release 8.0.12

targetRTS: observability listening not enabled

RTS debug: ->
```

If you started the RTS debugger by mistake, and instead intended to run the application without use of a debugger, just type the `quit` command. This will detach the debugger and let the application run by itself at full speed.

You can provide commands to the RTS Debugger already when launching your application by means of the command-line argument `-URTS_DEBUG`. This special command-line argument must come before any application-specific arguments and the TargetRTS uses it for extracting one or many initial commands for the RTS Debugger. For example, `-URTS_DEBUG=quit` means that the `quit` command will be passed to the RTS Debugger. If you want to pass more than one command to the RTS Debugger, separate them with semicolons (`;`). Enclose the command string in double quotes (`"`) in case it contains spaces.

The RTS Debugger reads commands on `stdin` and prints results on `stderr`. This means that if your application also prints to `stderr` there can be interleaved printouts. Consider using [log streams](../target-rts/logging.md#log-stream) to let your application print error messages to log files instead if this becomes a problem.

See [Commands](#commands) for a list of all commands supported by the RTS Debugger.

If you do not want to debug your application you can remove the RTS Debugger by means of the [`OTRTSDEBUG`](../target-rts/build.md#otrtsdebug) configuration setting. This will make the executable somewhat smaller.

## Thread Considerations
If the TargetRTS is built as multi-threaded (i.e. [`USE_THREADS`](../target-rts/build.md#use_threads) is set), the RTS Debugger runs in its own thread. This is the recommended way to use the RTS Debugger, because in a single-threaded application the RTS Debugger can only accept command input when the application is in a suspended state (before the top capsule has been incarnated, and when there are no more messages to dispatch in the application). Any blocking call in a user code snippet will block the RTS Debugger too if the application is single-threaded.

When using the RTS Debugger, each individual thread in your application can be either **attached** or **detached**. Threads that are detached run freely without intervention by the RTS Debugger, while threads that are attached run under the control of the RTS Debugger. This for example means that messages dispatched by an attached thread will only be processed by receiver capsule instances when the [`go`](#go) or [`step`](#step) commands are performed. It also means that you can inspect the capsule instances that are run by the thread using the `info` command.

By default the `time` thread (responsible for implementing [timers](../target-rts/timers.md)) is detached, while other threads are attached. It's recommended to keep the `time` thread detached, while other threads can be attached or detached as desired during the debug session.

## Commands
Below is a list of all commands supported by the RTS Debugger. Each command is described in a section of its own below the table.

| Command | Argument | Description | 
|----------|:-------------|:-------------|
| [attach](#attach) | `<threadId>` (number) | Make a thread attached so the RTS Debugger can control it.
| [continue](#continue) | N/A | Let the application run, and let the Art Debugger attach to it at any time.
| [detach](#detach) | `<threadId>` (number) | Make a thread detached so it can run freely without intervention by the RTS Debugger.
| [exit](#exit) | N/A | Terminate the debugged application.
| [go](#go) | `<n>` (number) | Deliver (up to) `<n>` messages (by default 10 messages)
| [help](#help) | N/A | Print information about all RTS Debugger commands to `stderr`.
| [info](#info) | `<capsuleInstance>` (string) | Print information about a specific capsule instance in the application.
| [log](#log) | `<category>` (string) `<detailLevel>` (string) | Configure logging for different categories of services in the TargetRTS.
| [printstats](#printstats) | `<threadId>` (number) | Print information about a specific thread in the application.
| [quit](#quit) | N/A | Disconnect the RTS Debugger and let the application run by itself at full speed.
| [saps](#saps) | N/A | Print information about all unwired ports in the application that are currently registered.
| [step](#step) | `<n>` (number) | Deliver (up to) `<n>` messages (by default 1 message)
| [system](#system) | `<capsuleInstance>` (string) `<depth>` (number) | Print information about all or a subset of the capsule instances that exist in the application.
| [tasks](#tasks) | N/A | List information about all threads in the application.
| [trace](#trace) | `on|off` | Turn tracing on or off and flush the current trace file, if any.

### attach
Argument: `<threadId>` (number)

Make the thread with the specified thread id attached so the RTS Debugger can control it. See [Thread Considerations](#thread-considerations) for more information. You obtain the thread id by using the [`tasks`](#tasks) command.

### continue
This command is used together with the `-obslisten` command-line argument. As described in [the Art Debugger documentation](debugging.md#attach) the `-obslisten=<port>` command-line argument specifies the port on which the Art Debugger can attach to the running application. Without also specifying `-URTS_DEBUG=continue` the application will become initially suspended while waiting for the Art Debugger to attach to it on the specified port. 

You can also perform the `continue` command from the RTS Debugger command prompt. This will detach all threads and let the application run freely. But contrary to the [quit](#quit) command the RTS Debugger will still be attached to the application and you can later attach the Art Debugger to the debug port to start debugging the application if the need arises.

### detach
Argument: `<threadId>` (number)

Make the thread with the specified thread id detached so it can run freely without intervention by the RTS Debugger. See [Thread Considerations](#thread-considerations) for more information. You obtain the thread id by using the [`tasks`](#tasks) command.

### go
Argument: `<n>` (number; default 10)

This command lets the application proceed its execution by delivering (up to) the specified number of messages in threads that are attached. This command works the same as [`step`](#step) except that the default number of messages that will be delivered is 10 instead of 1. Hence, the [`go`](#go) command is a "faster" way to execute the application than using [`step`](#step).

### help
This command prints information about all RTS Debugger commands to `stderr`.

### info
Argument: `<capsuleInstance>` (string)

This command prints detailed information about a specific capsule instance in the application. The capsule instance is identified by a string which consists of numbers separated by slashes (`/`) and dots (`.`). This string specifies the location of the capsule instance in the tree of capsule instances that is rooted in the top capsule instance. Examples:

`1` : The top capsule instance

`1/4` : The capsule instance contained in the part with id 4 in the top capsule instance

`1/3/2` : The capsule instance contained in the part with id 2 in the capsule instance contained in the part with id 3 contained in the top capsule instance

`1/5.2` : The capsule instance at index 2 (1-based) in the part with id 5 contained in the top capsule instance

Note that since most parts have multiplicity 1, the dot notation is only used for capsule instances contained at an index that is greater than 1 in a part with multiplicity that is greater than 1.

You obtain these strings by means of the [`system`](#system) command.

The following information is printed for the capsule instance:

* **ClassName** This is the name of the capsule from which the capsule instance was created (i.e. the dynamic type of the capsule instance).
* **ReferenceName** This is the name of the part in which the capsule instance is located. For the top capsule instance the special name `application` is used.
* **CurrentState** This is the state that is currently active in the capsule state machine. For a nested state this will be a qualified string that shows the path to the active state in the hierarchical state machine. If the state machine has not reached its initial state yet (for example if it is still running the initial transition), the special name `<machine>` is used.
* **Address** The C++ class that implements the capsule and the memory address of the capsule instance. Note that the C++ class name will be printed with the suffix "_Actor". This is printed since in Model RealTime capsule classes have that suffix in their names. However, in {$product.name$} they do not have this suffix.
* Information about actor probes. When the Art Debugger is attached to the application, there could be an actor probe, but not otherwise.
* Information about ports. This includes what ports exist on the capsule, and their current state (e.g. if they are wired, i.e. bound, to another port). You can also see which ports that are public (i.e. server ports). Each port is identified by an id (a number starting with 0).
* Information about parts (in this context referred to as "components"). Each part is identified by a number (starting with 1).

Example:

```shell
RTS debug: ->info 1/2
ClassName    : RangeCounter
ReferenceName: counter
CurrentState : Active::Counting
Address      : (RangeCounter_Actor*)0x1c09b5e35a0
No Actor Probe attached.

Relay ports:
    0: server

Public end ports:
    0: server (wired)
```

### log
Arguments: `<category>` (string) `<detailLevel>` (string)

This command configures logging for services of the TargetRTS. The `<category>` specifies the service to configure logging for and is one of the following:

* **communication** Sending and receiving of messages (both asynchronous and synchronous communication). Also includes use of the [defer queue](../target-rts/message-communication.md#defer-queue).
* **exception** Raising of exceptions on ports.
* **frame** Use of [Frame](https://secure-dev-ops.github.io/code-realtime/targetrts-api/struct_frame.html) ports, for example to incarnate an optional capsule part.
* **layer** Use of [unwired ports](../art-lang/index.md#unwired-port), for example registering or deregistering them.
* **timer** Use of [timers](../target-rts/timers.md), for example setting or cancelling a timer.
* **system** Includes various error situations inside the TargetRTS, such as out of memory or other unexpected run-time problems.
* **all** All of the above.

The `<detailLevel>` is either

* **none** Turn off logging for the specified category.
* **errors** Turn on logging for the specified category, but only for events that indicate that an error occurred.
* **all** Turn on logging for the specified category.

Exactly what gets logged depends on the category, but in many cases the logged information follows the format described in [TargetRTS Error Logging](../target-rts/logging.md#targetrts-error-logging).

Example:

```shell
RTS debug: ->log comm all

RTS debug: ->go 
  go 10

RTS debug: 9>message
  to   counter(RangeCounter)<Active::Counting>.timer[0]:timeout
  data (void *)0x0
```

### printstats
Argument: `<threadId>` (number)

This command prints information about the thread with the specified id. You obtain the thread id by using the [`tasks`](#tasks) command.

The printed information includes the following:

* The name of the thread. For user-defined threads the name comes from the [Threads](../building/transformation-configurations.md#threads) TC property. The main thread is identified by the name "main" and the timer thread (responsible for implementing [timers](../target-rts/timers.md)) is identified by the name "time".
* The most recent error that has occurred in the thread. For more information see [Retrieving the Most Recent Error](../target-rts/logging.md#retrieving-the-most-recent-error).
* The number of messages that are currently waiting in the Controller's queues (both the internal queue and the incoming queue) to be dispatched to capsule instances that are run by the thread. For more information see [Controllers and Message Queues](../target-rts/message-communication.md#controllers-and-message-queues). Messages are grouped in the printout according to their [priority](../target-rts/message-communication.md#message-priority).

### quit
This command detaches all threads and disconnects the RTS Debugger from the application so it can run freely at full speed. It's not possible to later attach the RTS Debugger to the running application.

### saps
This command can be useful in applications that use [unwired ports](../art-lang/index.md#unwired-port). It prints all unwired ports that are currently registered, what name they are registered with (by default the port name), and the number of SAP and SPP port instances.

Example:

```shell
RTS debug: ->saps
Service: ':'
  Name (SAPs,SPPs)
    p ( 1, 1 )
```

### step
Argument: `<n>` (number; default 1)

This command lets the application proceed its execution by delivering (up to) the specified number of messages in threads that are attached. This command works the same as [`go`](#go) except that the default number of messages that will be delivered is 1 instead of 10. Hence, the [`step`](#step) command is a "slower" way to execute the application than using [`go`](#go).

### system
Arguments: `<capsuleInstance>` (string) `<depth>` (number; default 0)

This command prints information about capsule instances that exist in the application at the current point in time. Both arguments are optional and if they are omitted all capsule instances in the application will be printed. If you specify a specific capsule instance (see the [`info`](#info) command for the format of the capsule instance string) then only that capsule instance and the capsule instances it contains (directly or indirectly) will be printed. If you specify `<depth>` it limits how deeply nested capsule instances that will be printed. For example, 2 means that only the specified capsule instance and its directly contained capsule instances will be printed. 

For each part the following information is printed:

* The containment nesting. For each level in the composite structure hierarchy a dot (`.`) is printed.
* The part name. The implicit part that holds the top capsule instance is denoted with the special name "application".
* The name of the capsule that types the part.
* The kind of part (fixed, optional or plugin).
* The current state of the capsule's state machine. For hierarchical state machines this information can be hard to read and it's better to use the [`info`](#info) command to retrieve that information.
* The string that identifies the capsule instance (see the [`info`](#info) command for the format of this string).

Example:

```shell
RTS debug: 1>system 
application : Top(optional) <:<machine>:ManageCommandPrompt> 1
. server : Server(optional) <:<machine>:WaitForRequest> 1/1
. counter : RangeCounter(optional) <:<machine>:Active:Active::Counting> 1/2
. counter : RangeCounter(optional) <:<machine>> 1/2.2
```

### tasks
In this context a task is synonymous with a thread. The command prints a list of all threads in the application. For each thread the following information is provided:

* The thread id (a.k.a. the task id). You need this id when using the [`attach`](#attach) or the [`detach`](#detach) commands.
* The current state of the thread. Possible states are:
  - **detached** : The thread is detached. See [Thread Considerations](#thread-considerations) for more information. All other thread states apply only for attached threads.
  - **stopped** : The thread is currently stopped and does not do anything. (Internally it actually may be running some code, but in that case it's TargetRTS code that is not originating from a user code snippet.)
  - **stepping** : The thread is executing code (originating from a user code snippet, such as a transition code snippet).
* The name of the thread. For user-defined threads the name comes from the [Threads](../building/transformation-configurations.md#threads) TC property. The main thread is identified by the name "main" and the timer thread (responsible for implementing [threads](../target-rts/threads.md)) is identified by the name "time".

Example:

```shell
RTS debug: ->tasks
  0: stopped  main
  1: stopped  ServerThread
  2: detached time
```

### trace
Arguments: `on|off` (string)

This command is used for [tracing](tracing.md) the exchange of messages in an application with the purpose of visualizing them in a sequence diagram. If the argument is omitted (or an invalid argument is passed), the command will just print whether tracing is currently on or off. For example:

```shell
RTS debug: ->trace
  Tracing is on
```

If a trace is already active when the command is performed, the current trace file will be flushed to ensure that all trace events that have been captured so far will be present in the trace file.