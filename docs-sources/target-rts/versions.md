!!! note 
    Some of the information in this chapter is only applicable for the Commercial Edition of {$product.name$} since it includes the source code for the TargetRTS. With the Community Edition comes only precompiled versions of the TargetRTS for a limited number of commonly used target configurations.

It's common to extend and modify the TargetRTS with your own utilities and customizations. In this case you will build your application against a copy of the TargetRTS that contains these changes. However, when a new version of the TargetRTS is released, you then must incorporate the changes in that new version into your own copy of the TargetRTS. This document helps with this process by documenting all changes made in the TargetRTS. It also describes some strategies for more easily managing multiple versions of the TargetRTS.

!!! note 
    The version of the TargetRTS is defined in the file `RTVersion.h` by means of the macro `RT_VERSION_NUMBER`.

## Patch Files
To simplify the process of adopting changes from a new version of the TargetRTS, so called patch files are provided in the folder `TargetRTS_changelog` (located next to the `TargetRTS` folder). The patch files have names `<from-version>_<to-version>.patch` and contain all changes made from one version to another. You can use the command-line tool `patch` to automatically apply the changes of a patch file to your own copy of the TargetRTS. 

For example, to apply the changes from version 8000 to version 8002, go to the folder that contains the `TargetRTS` and `TargetRTS_changelog` folders and run this command:

```
patch -p3 < TargetRTS_changelog/8000_8002.patch
```

You can also downgrade the version of the TargetRTS by running the same command but with the `-R` flag.

!!! note
    The `patch` command is included in Linux and Unix-like operating systems, but on Windows you have to download it separately. You can for example get it through the [Git for Windows](https://gitforwindows.org/) set of tools.

The patch files in the `TargetRTS_changelog` folder have been created by a Bash script `TargetRTS/tools/createPatch.sh`. You can use this script if you have your version of the TargetRTS in a Git repo and want to produce a patch file for the changes you have made to the TargetRTS. You can then later use that patch file to apply your changes to a newer version of the TargetRTS.

Whether it's best to adopt changes in a standard TargetRTS into your version of the TargetRTS, or to do the opposite, i.e. adopt your changes into a standard TargetRTS, may depend on how big changes you have made. If your changes are small and limited the latter may be easiest, while if you have made substantial changes the former may be the better option.

## Change Log
Below is a table that lists all changes made in the TargetRTS since version 8000 (which was delivered with {$product.name$} 1.0.0). For changes in older versions of the TargetRTS, which were done for {$rtist.name$}, see [this document](https://model-realtime.hcldoc.com/help/topic/com.ibm.xtools.rsarte.webdoc/pdf/ModelRealTime_RoseRT_All_Changes_in_Cpp_TargetRTS.pdf).

| TargetRTS Version | Included Changes | 
|----------|:-------------|
| 8001 | [JSON Decoding](#json-decoder) | 
| 8002 | [Building without rtperl](#building-without-rtperl) <br> [JSON parser](#json-parser) <br> [Script for creating TargetRTS patch files](#script-for-creating-targetrts-patch-files) <br> [Pointers in JSON encoding/decoding](#pointers-in-json-encodingdecoding) | 
| 8003 | [Align terminology in comments](#align-terminology-in-comments) <br> [Configurable max TCP Connections](#configurable-max-tcp-connections) |
| 8004 | [Improved implementation of JSON parser](#improved-implementation-of-json-parser) <br> [JSON encoding/decoding for RTByteBlock](#json-encodingdecoding-for-rtbyteblock) <br> [New target configuration for MacOS on AArch64](#new-target-configuration-for-macos-on-aarch64) |
| 8005 | [New free list macros](#new-free-list-macros) |
| 8006 | [Static analysis warning reductions](#static-analysis-warning-reductions) <br> [New debugger API "getChildren"](#new-debugger-api-getchildren) |
| 8007 | [Handle type names containing spaces in encoding/decoding](#handle-type-names-containing-spaces-in-encodingdecoding) |
| 8008 | [Extend debugger API "getChildren" to obtain active state](#extend-debugger-api-getchildren-to-obtain-active-state) <br> [Long double](#long-double) <br> [RTCONFIG_INFO](#rtconfig_info) <br> [Protocol constructor initializer order](#protocol-constructor-initilizer-ordering) |
| 8009 | [Simplified qualified names of nested states](#simplified-qualified-names-of-nested-states) |
| 8010 | [Log streams](#log-streams) <br> [Corrected deletion in RTProtocolAdapter destructor](#corrected-deletion-in-rtprotocoladapter-destructor) <br> [JSON construction in debugger API "getChildren"](#json-construction-in-debugger-api-getchildren)|
| 8011 | [Log streams connected to files](#log-streams-connected-to-files) |
| 8012 | [New tracing feature for sequence diagram visualization of message communication](#new-tracing-feature-for-sequence-diagram-visualization-of-message-communication) |
| 8013 | [Waiting for multiple events](#waiting-for-multiple-events) <br> [Application exit code API](#application-exit-code-api) <br> [Public function "getTask" in RTDebugger](#public-function-gettask-in-rtdebugger) <br> [Priority for event raised on external port](#priority-for-event-raised-on-external-port) <br> [Improved error handling in REGISTER_LAYER](#improved-error-handling-in-register_layer)  <br> [Support for a new trace file format (.art-trace)](#support-for-a-new-trace-file-format-art-trace) |
| 8014 | [Shorter state qualifiers in the RTSDebugger system command](#shorter-state-qualifiers-in-the-rtsdebugger-system-command) <br> [New RTLock utility](#new-rtlock-utility) <br> [Printing 64 bit integers in RTFormat](#printing-64-bit-integers-in-rtformat) <br> [More information for messages when tracing](#more-information-for-messages-when-tracing) <br> [Error code for circular import](#error-code-for-circular-import) <br> [Unparse and merge of RTJsonResult](#unparse-and-merge-of-rtjsonresult) <br> [Removal of support for .ms trace format](#removal-of-support-for-ms-trace-format) <br> [Trace configuration and timestamps](#trace-configuration-and-timestamps) |
| 8015 | [RTLogStream performance improvements](#rtlogstream-performance-improvements) <br> [Tracing of synchronous messages](#tracing-of-synchronous-messages) <br> [Extended RTTracer API](#extended-rttracer-api) <br> [Include the `time2_receive` timestamp by default in traces](#include-the-time2_receive-timestamp-by-default-in-traces) <br> [Configuration of trace file name](#configuration-of-trace-file-name) <br> [Thread information for traced instances](#thread-information-for-traced-instances) <br> [Removed C++ 14 flag for Clang target configurations](#removed-c-14-flag-for-clang-target-configurations) |
| 8016 | [Startup synchronization of RTTimerActor](#startup-synchronization-of-rttimeractor) <br> [Port full warning](#port-full-warning) |
| 8017 | [Improvements in RTTracer::note()](#improvements-in-rttracernote) <br> [Run-time error checks for port connections](#run-time-error-checks-for-port-connections) <br> [Inclusion of program arguments in trace configuration](#inclusion-of-program-arguments-in-trace-configuration) |
| 8018 | [Null pointer checks in RTWrapper](#null-pointer-checks-in-rtwrapper) <br> [Using log streams with encoding disabled](#using-log-streams-with-encoding-disabled) |
| 8019 | [Script for generating compile_commands.json for the TargetRTS](#script-for-generating-compile_commandsjson-for-the-targetrts) <br> [Configuration of trace file flushing](#configuration-of-trace-file-flushing) <br> [Registration of custom debug error function](#registration-of-custom-debug-error-function) |

### JSON decoder
A new decoder class [`RTJsonDecoding`](../targetrts-api/class_r_t_json_decoding.html) is now available for decoding messages and data from JSON. JSON produced from data by the JSON Encoder ([`RTJsonEncoding`](../targetrts-api/class_r_t_json_encoding.html)) can be decoded back to (a copy of) the original data.

### Building without rtperl
New macros were added in makefiles to support building generated applications without using `rtperl`.

### JSON parser
A new class [`RTJsonParser`](../targetrts-api/class_r_t_json_parser.html) can be used for parsing arbitrary JSON strings. It has a more general use than [`RTJsonDecoding`](../targetrts-api/class_r_t_json_decoding.html) which is specifically for decoding JSON that has been produced by [`RTJsonEncoding`](../targetrts-api/class_r_t_json_encoding.html). See [this chapter](encoding-decoding.md#json-parser) for more information.

### Script for creating TargetRTS patch files
A Bash script `createPatch.sh` is now available in the `tools` folder of the TargetRTS. It can be used for producing patch files describing the differences between two versions of the TargetRTS. See [Patch Files](#patch-files) for more information.

### Pointers in JSON encoding/decoding
Data of pointer type is now encoded to a string by the JSON encoder ([`RTJsonEncoding`](../targetrts-api/class_r_t_json_encoding.html)) and can be decoded back to a memory address by the JSON decoder ([`RTJsonDecoding`](../targetrts-api/class_r_t_json_decoding.html)).

### Align terminology in comments
Several comments were updated to align the terminology used in Code and Model RealTime. This was done so that the Doxygen documentation that is generated from the TargetRTS header files will be easy to understand for users of both products.

### Configurable max TCP connections
The [`RTTcpSocket`](../targetrts-api/class_r_t_tcp_socket.html) class has a new function `setMaxPendingConnections()` which can be used for setting the maximum number of clients that can connect to the TCP socket. Previously this limit was always 5, and this is still the default in case you don't call this function to change it.

### Improved implementation of JSON parser
The [`RTJsonParser`](../targetrts-api/class_r_t_json_parser.html) now has an improved recursive implementation that uses a map instead of a vector for storing keys and values in the [`RTJsonResult`](../targetrts-api/class_r_t_json_result.html) object. The new implementation provides new functions `RTJsonResult::keys_begin()` and `RTJsonResult::keys_end()` which allows to iterate over the keys in the parse result without knowing their names.

### JSON encoding/decoding for RTByteBlock
The [`RTJsonEncoding`](../targetrts-api/class_r_t_json_encoding.html) and [`RTJsonDecoding`](../targetrts-api/class_r_t_json_decoding.html) now support JSON encoding/decoding for objects of the [`RTByteBlock`](../targetrts-api/class_r_t_byte_block.html) class.

### New target configuration for MacOS on AArch64
A new target configuration for the Clang 15 compiler for MacOs with ARM processor is now available. It has the name `MacT.AArch64-Clang-15.x`.

### New free list macros
New TargetRTS configuration macros are now available in `include/RTConfig.h` for configuring the [free list](message-communication.md#message-memory-management). The new macros are [MIN_FREE_LIST_SIZE](build.md#min_free_list_size), [MAX_FREE_LIST_SIZE](build.md#max_free_list_size) and [RTMESSAGE_BLOCK_SIZE](build.md#rtmessage_block_size). Previously these configuration settings were hard-coded at a number of places in the TargetRTS implementation, but now they are handled like all other configuration settings.

### Static analysis warning reductions
Some static analysis tools previously reported a few warnings on the TargetRTS source code which now have been fixed.

- Reordered member variables according to their types to potentially reduce the size of the container struct or class on certain platforms
- Moved definition of [RTInjector](../targetrts-api/class_r_t_injector.html)::getInstance() from inline function to `RTInjector.cpp` to ensure it always returns a singleton object
- Removed the unused local variable `attached` in the implementation of [RTDebugger](../targetrts-api/class_r_t_debugger.html)::printActorInfo()
- Removed unused #includes
- Removed duplicated assignments of `remotePort` and `remoteIndex` in [RTProtocol](../targetrts-api/class_r_t_protocol.html)::reply()
- Changed type of the `need_lock` variable in [RTProtocol](../targetrts-api/class_r_t_protocol.html)::reply() from int to bool
- Removed dead code
- Improved initialization of a memory buffer in [RTToolSetObserver](../targetrts-api/class_r_t_toolset_observer.html)::sendTxBuffer()

### New debugger API "getChildren"
A new debugger API for getting a JSON representation of the runtime structure of a debugged application is now available. It includes information about the capsule instance tree and metadata about the debugged application which is available in the TargetRTS. It is used by the [Art Debugger](../running-and-debugging/debugging.md) for populating the Art Debug view when debugging an application in {$product.name$}.

### Handle type names containing spaces in encoding/decoding
Type descriptor names for primitive types that contain spaces have been changed to use an underscore (`_`) instead of a space. This affects how values of such types are encoded/decoded. For example the value `4` of type `unsigned long` will now be encoded as `unsigned_long 4`. This change was done since during decoding a space is used for separating the type name from the value. Previously it was therefore not possible, while debugging, to send events with a data parameter typed by such types, but after this change it now works. Note that if your application somehow relies on the specific encoded format for values of types with a space in their names, it must be updated to accomodate for this change. 

### Extend debugger API "getChildren" to obtain active state
The debugger API "getChildren" now includes information about the state that is initially active for each capsule instance. 

### Long double
The TargetRTS now supports `long double` as other predefined C++ types. The Log port API was extended to allow logging long double data, and it is also supported in encoding/decoding.

### RTCONFIG_INFO
A [new configuration macro](build.md#rtconfig_info) has been added for controlling if the `config_info` array should be included in `src/RTMain/mainLine.cc`. Previously this array was always included, but not used, which could cause compiler warnings.

### Protocol constructor initilizer ordering
The order of initializers in the [RTProtocol](../targetrts-api/class_r_t_protocol.html) constructor was changed to match the declaration order of the initialized member variables. This avoids a compiler warning.

### Simplified qualified names of nested states
The function `getStateStr()` in `eventMatches.cc` now returns a simplified representation of nested states that consists of the names of active states separated by a single colon (`:`). Previously, each state name was fully qualified with double colons (`::`) which led to unnecessary complexity when parsing these strings during a debug session.

### Log streams
The logging service was extended to support log streams. They remove a number of limitations that apply when you log messages by means of log ports. For example, log streams can be used from any code, not just from code in capsules, they can be locked and unlocked to avoid interleaved log messages in a multi-threaded application, and you can use standard C++ stream manipulators for formatting text and data to obtain a more readable log. See [this chapter](logging.md#log-stream) for more information about log streams.

### Corrected deletion in RTProtocolAdapter destructor
The destructor of [RTProtocolAdapter](../targetrts-api/class_r_t_protocol_adapter.html) deleted an array using the standard `delete` operator. This has now been corrected to instead use the `delete[]` operator.

### JSON construction in debugger API "getChildren"
A bug was fixed in the "getChildren" debugger API implementation related to how JSON is constructed for a capsule that lacks parts and/or ports.

### Log streams connected to files
Log streams can now be connected to any `std::ostream`, and you can for example let them write log message to a file.

### New tracing feature for sequence diagram visualization of message communication
It's now possible to turn on a new kind of tracing in applications where messages that are sent between capsule instances can be visualized graphically in a sequence diagram. See [this chapter](../running-and-debugging/tracing.md) for more information about this feature.

### Waiting for multiple events
A new utility class [RTMultiReceive](../targetrts-api/class_r_t_multi_receive.html) now makes it easier to wait in a state until multiple events have been received, before transitioning to another state. See [this chapter](message-communication.md#waiting-for-multiple-messages) for more information.

### Application exit code API
The [RTMain](../targetrts-api/class_r_t_main.html) class has two new functions for getting and setting the exit code of the application (`getExitCode()` and `setExitCode()`). The default exit code is 0 (as before).

### Public function "getTask" in RTDebugger
The function [RTDebugger](../targetrts-api/class_r_t_debugger.html)::getTask() is now public which makes it possible to programmatically access the current debugger tasks. See the [`tasks`](../running-and-debugging/rts-debugger.md#tasks) command of the RTS Debugger for more information about tasks.

### Priority for event raised on external port
A capsule that has an [external port](../target-rts/integrate-with-external-code.md#external-port) can now specify the priority at which an event that an external thread raises on the port should be sent. The function `enable()` now accepts the desired message priority as an optional parameter (the default message priority is still `General`).

### Improved error handling in REGISTER_LAYER
A new virtual function [RTController](../targetrts-api/class_r_t_controller.html)::registerLayer() was added. The default implementation of this function just reports a run-time error (and is hence not expected to be called), but the overridden function in [RTCustomController](../targetrts-api/class_r_t_custom_controller.html) provides a useful implementation (which is the same as before). This change has made it possible to remove the cast to [RTCustomController](../targetrts-api/class_r_t_custom_controller.html) in the `REGISTER_LAYER` macro, which would previously cause a crash if called with another type of controller. Now that error scenario instead leads to the run-time error `badOperation`.

### Support for a new trace file format (.art-trace)
The TargetRTS now supports generating traces of messages that are sent between capsule instances in a new file format (`.art-trace`). This is now the default trace file format, and the previously supported `.ms` trace file format now has to be enabled by means of a new command-line option `-traceFormat=ms`. See [this chapter](../running-and-debugging/tracing.md) for more information about the new trace file format and how to use it in {$product.name$}.

### Shorter state qualifiers in the RTSDebugger system command
Previously the RTSDebugger's [system](../running-and-debugging/rts-debugger.md#system) command would print the qualified name of the active state in a way where each state name in the qualifier was itself qualified. Now this has been fixed and qualified state names are now printed in a more readable way.

### New RTLock utility 
A new utility class [RTLock](../targetrts-api/class_r_t_lock.html) can be used for protecting a piece of code from being run by more than one thread at the same time.

### Printing 64 bit integers in RTFormat
The [RTFormat](../targetrts-api/class_r_t_format.html) class has two new functions for printing 64 bit integers. For signed integers use `_int64_t()` and for unsigned integers use `_uint64_t()`.

### More information for messages when tracing
When capturing a trace in the `.art-trace` format information about the sender port, as well as the sender and receiver port index, is now included for messages. Also, if a message data is present but cannot be ASCII encoded it's shown in the trace with a `?`. If a message has no data an empty string is printed instead of `void` as previously. See [this chapter](../running-and-debugging/tracing.md#message) for more information.

### Support for the primitive type `wchar_t`
The TargetRTS now supports use of wide characters, and arrays of wide characters, using the primitive type `wchar_t`. A type descriptor for this type is available so it for example can be encoded and decoded.

### Error code for circular import
When importing a capsule instance into a plugin capsule part a run-time check is performed (unless the setting [RTIMPORT_ISREFERENCEDBY_CHECK](build.md#rtimport_isreferencedby_check) has been turned off). Previously, if this check detected that the import would lead to a cycle in the composition hierarchy the general error [RTController](../targetrts-api/class_r_t_controller.html)::`badClass` would be reported. Now a more specific error [RTController](../targetrts-api/class_r_t_controller.html)::`circularImport` is reported instead.

!!! note 
    This change is not backwards compatible. You need to update your code if it checks for the old error code.

### Unparse and merge of RTJsonResult
A new function [RTJsonResult](../targetrts-api/class_r_t_json_result.html)::`unparse()` was implemented to unparse (i.e. pretty-print) a JSON object to an output stream. Another new function [RTJsonResult](../targetrts-api/class_r_t_json_result.html)::`merge()` was implemented for merging one JSON object into another.

!!! note 
    As part of this change the error constant `RTJsonResult::ERROR` was renamed to `RTJsonResult::jsonError` to avoid a name clash when including `<windows.h>`. This change is not backwards compatible.

### Removal of support for .ms trace format
The TargetRTS no longer generates the `.ms` trace format. Instead, this format can be obtained by translating the `.art-trace` format. The module that parses `.art-trace` files is now open-source at [GitHub](https://github.com/HCL-TECH-SOFTWARE/art-trace) and a [sample script](https://github.com/HCL-TECH-SOFTWARE/art-trace/blob/main/samples/jsSequenceDiagrams.ts) is provided for creating the `.ms` trace format from an `.art-trace` file.

### Trace configuration and timestamps
Tracing can now be configured by passing a trace configuration JSON file with the command-line argument `-traceConfig` to an application. Currently the trace configuration file can be used for turning on the capturing of timestamps for messages. Two time-stamps can be captured; the time when a message is received (i.e. dispatched to) a capsule instance and the time when a message has been handled by the capsule instance's state machine. The difference between these timestamps tell how much time it took to process the message. For more information see [Trace Configuration](../running-and-debugging/tracing.md#trace-configuration).

### RTLogStream performance improvements
A new configuration setting [RTS_LOGSTREAM](build.md#rts_logstream) can be used for turning off the [Log Stream](logging.md#log-stream) feature in case you don't use it. Also, the log stream feature is no longer automatically available through the `RTLog.h` header file, and you must now include a new header file `RTLogStream.h` to use it. The reason for these changes is to avoid an increased size of your executable in case it uses log ports, but doesn't use the log stream feature.

### Tracing of synchronous messages
The tracing feature has been extended to include [synchronous messages](../running-and-debugging/tracing.md#synchronous-communication) (invoke/reply). 

### Extended RTTracer API
The [RTTracer](../targetrts-api/class_r_t_tracer.html) API has been extended with new functions for programmatically providing a trace configuration file (as an alternative to providing it through the `-traceConfig` command-line argument), to check whether a trace configuration file has been provided, and to write a note to the trace. All these new functions are used in a new sample application [Tracing](../samples.md#tracing).

### Include the `time2_receive` timestamp by default in traces
Traces will now by default include the [`time2_receive`](../running-and-debugging/tracing.md#receive-time) timestamp, and you need to use a trace configuration file if you don't want any timestamps in your captured traces.

### Configuration of trace file name
The tracing feature now supports new trace configuration properties for setting the trace file name ([`trace_file`](../running-and-debugging/tracing.md#trace-file-name)) and whether an existing trace file with the same name should be overwritten or not ([`trace_file`](../running-and-debugging/tracing.md#trace-file-name)).

### Thread information for traced instances
The name of the thread that runs a capsule instance is now included in captured trace files.

### Removed C++ 14 flag for Clang target configurations
Previously the Clang target configurations were hardcoded to always use the C++ 14 language standard. This prevented use of more modern C++ constructs with these configurations. Now these target configurations work like others and do not hardcode a specific language version (the one selected in the TC will be used when building the application).

### Startup synchronization of RTTimerActor
On certain platforms a race condition at start-up could cause the [RTTimerController](../targetrts-api/class_r_t_timer_controller.html) (run by a timer thread) to access the [RTTimerActor](../targetrts-api/class_r_t_timer_actor.html) object (run by the main thread) before it had been completely initialized. Now this is prevented by synchronization between these threads at start-up.

### Port full warning
A new configuration setting [PORTFULL_WARNING](build.md#portfull_warning) is now available. If set, a runtime warning will be printed if there is an attempt to connect more SAP ports to an SPP port than what the multiplicity of the SPP port allows.

### Improvements in `RTTracer::note()`
The function [RTTracer](../targetrts-api/class_r_t_tracer.html)::note() now takes a `const std::string&` parameter instead of a `const char*`. Also, a note is not printed if tracing is currently disabled.

### Run-time error checks for port connections
A few defensive null pointer checks, and the printing of run-time errors, have been added in code that uses port connections. For example, the code can now cope with a situation where a connected port is dangling without an owner. Under normal circumstances these scenarios are not expected, but should they anyway occur these checks and run-time errors can help the troubleshooting.

### Inclusion of program arguments in trace configuration
The comment with the trace configuration at the beginning of an `.art-trace` file now contains an "args" array with the command-line arguments for the traced application.

### Null pointer checks in RTWrapper
Missing null checks were added in the implementation of [RTWrapper](../targetrts-api/class_r_t_wrapper.html).

### Using log streams with encoding disabled
Previously it was not possible to use [log streams](logging.md/#log-stream) if the configuration macro [OBJECT_ENCODE](build.md#object_decode-and-object_encode) was not set. This is now fixed.

### Script for generating compile_commands.json for the TargetRTS
A new Node JS script `generate-compile-commands.js` is available in the `TargetRTS` folder. It can generate the compilation database (`compile_commands.json`) which is required by the Clang language server. For more information about this script see [this chapter](index.md#working-with-the-source-files).

### Configuration of trace file flushing
By default a trace file is flushed after every line that is printed to it. This ensures that no trace events are missed if the traced application is forcibly terminated. However, it can have a negative impact on performance to flush the trace file too often. Therefore the TargetRTS now provides a configuration setting [RTTRACER_FLUSH_COUNT](build.md#rttracer_flush_count) for configuring how often the trace file should be flushed. The value specifies the number of lines to write to the trace file before it's flushed. Set it to 0 to not force flush the trace file, but only let it happen when the underlying buffer is full. This is best for performance but also means that trace events written since the last time the trace file was flushed will be lost if the application terminates.

### Registration of custom debug error function
The [RTMain](../targetrts-api/class_r_t_main.html) class has a new function (`registerDebugErrorFunction()`) for registering a function that will be called whenever an error message is printed by `RTDebugger::trace()`. This makes it possible to capture such error messages and report them in some other way (for example write them to a file).
