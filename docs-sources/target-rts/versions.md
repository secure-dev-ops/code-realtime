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
Below is a table that lists all changes made in the TargetRTS since version 8000 (which were delivered with {$product.name$} 1.0.0). For changes in older versions of the TargetRTS, which were done for {$rtist.name$}, see [this document](https://model-realtime.hcldoc.com/help/topic/com.ibm.xtools.rsarte.webdoc/pdf/ModelRealTime_RoseRT_All_Changes_in_Cpp_TargetRTS.pdf).

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
The order of initializers in the [Protocol](../targetrts-api/class_r_t_protocol.html) constructor was changed to match the declaration order of the initialized member variables. This avoids a compiler warning.