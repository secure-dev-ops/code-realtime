!!! note 
    The information in this chapter is only applicable for the Commercial Edition of {$product.name$} since it includes the source code for the TargetRTS. With the Community Edition comes only precompiled versions of the TargetRTS for a limited number of commonly used target configurations.

## Build
To build the TargetRTS you need to have Perl installed. On Linux and macOS Perl is usually already available, while on Windows you have to download and install it yourself. One way to get Perl on Windows is to use [GitBash](https://gitforwindows.org). See the [Perl web page](https://www.perl.org/get.html) for other options. 

!!! hint 
    As a user of {$product.name$} Commercial Edition you also have access to {$rtist.name$} which includes a version of Perl, called `rtperl`. It can be found inside the plugin `com.ibm.xtools.umldt.rt.core.tools` in the {$rtist.name$} installation. If you want to use this version of Perl, locate the version under `tools` that matches your operating system and add its folder to your PATH variable.

Follow these steps to build the TargetRTS from its sources:

1. Open the {$product.name$} .vsix file as an archive with a ZIP tool, and unzip the folder `extension/TargetRTS` into a folder. 
2. Make sure the unzipped folder, and everything it contains, is writable.
3. From a command-line prompt with Perl in the PATH go into the `src` subfolder of the unzipped folder and invoke a command similar to the below:

``` shell
perl Build.pl WinT.x64-MinGw-12.2.0 make all
```

The Perl script `Build.pl` drives the build process of the TargetRTS, but uses a make tool for the bulk of the work. The first argument to the script is the name of the [target configuration](index.md#target-configurations) to use. This is the same name as is specified with the TC property [`targetConfiguration`](../building/transformation-configurations.md#targetconfiguration). The second argument to the script is the make tool to use. It corresponds to the TC property [`makeCommand`](../building/transformation-configurations.md#makecommand). The final argument is a make target defined in the file `main.mk`. To build everything use the target `all`.

The object files produced during the build will be placed in an output folder inside the `TargetRTS` folder. The name of this folder is `build-<target_configuration>` where `<target_configuration>` is the name of the target configuration used. When all object files have been built, library files will be created from them and placed in a `lib/<target_configuration>` sub folder. Any existing libraries in that folder, such as the precompiled versions of the TargetRTS, will be overwritten.

### Flat Builds
The `Build.pl` script accepts an optional flag `-flat` which, if used, should be the first argument. This flag causes the script to concatenate all source files that belong to the same class into a single file (placed in the output folder), and then build those concatenated file. This significantly reduces the number of source files to compile and therefore often speeds up the build. But beware that when [debugging the TargetRTS](#debug), you will debug these concatenated files, rather than the original source code. Do not change the concatenated files as those changes will be lost the next time you build the TargetRTS with the `-flat` flag.

## Debug
To be able to debug the TargetRTS, you need to build it with debug symbols included. Follow these steps (either in an existing target configuration, or in a new one you have created):

1. Open `libset.mk` in a text editor. This file is located in a subfolder under the [`libset`](index.md#libset) folder depending on what target configuration you are using. For example `TargetRTS/libset/x64-MinGw-12.2.0/libset.mk`.
2. Modify the variable `LIBSETCCEXTRA` to include the flag `$(DEBUG_TAG)`. This variable expands to the debug compilation flag of the compiler. You might also want to remove any specified optimization flags since they can make debugging harder.
3. Now build the TargetRTS by means of the `Build.pl` Perl script as [mentioned above](#build).

You also need to build the generated code with debug symbols included. To do this set the [`compileArguments`](../building/transformation-configurations.md#compilearguments) property in the TC to include the `$(DEBUG_TAG)` tag (and remove any optimization flags, if present).

!!! note 
    The Visual Studio compiler also requires a link argument `/DEBUG` to be set to include debug symbols in an executable. Use the [`linkArguments`](../building/transformation-configurations.md#linkarguments) TC property to set it.

If you updated an existing target configuration and TC that were already built without debug symbols previously, make sure to do a clean build. The easiest way to do a clean build of the TargetRTS is to simply remove the entire output folder where the object files are placed (the output folder is named `build-<target_configuration>`). To do a clean build of your application, perform the **Clean** command in the TC context menu, followed by **Build**.

## Customize
There are many opportunities to customize the TargetRTS, and several good reasons to do so. Two common reasons are:

1. You want to build your application for a target environment (OS, compiler etc) for which there is no existing target configuration. See [Creating a New Target Configuration](#creating-a-new-target-configuration).
2. You want to change the behavior of the TargetRTS, for example to configure one or many of its features, remove features you don't need, or extend it with some own-developed features. See [Configure or Change the TargetRTS](#configure-or-change-the-targetrts).

### Creating a New Target Configuration
Examples when you need to create a new target configuration include:

* You need to use a different C++ compiler.
* You need to build for a different operating system (or no operating system at all).
* You want to modify some settings in an existing target configuration, but like to keep that original target configuration unchanged.

Rather than creating a new target configuration from scratch, it's easier to start by copying an existing one. Pick a target configuration that resembles the one you like to create, and copy its subfolder under [`config`](index.md#config). 

For example, if you want to create a new target configuration for using the latest version of the MinGw compiler on Windows, a good starting point is to copy `config/WinT.x64-MinGw-12.2.0` since most things will be the same as in that target configuration. Also copy the libset folder `libset/x64-MinGw-12.2.0`. Rename the copied folders for the new MinGw version and update any settings as required. For this scenario you don't need to create a new target since the existing `target/WinT` can be used also for this new target configuration.

If your new target configuration is for a different operating system you also need to create a target for it. Create a subfolder under `target` according to the naming conventions (see [target configurations](index.md#target-configurations)). The name of this subfolder must be used as the first part of your target configuration name (the text before the dot). Also create a new subfolder under `src/target` where you can place source code that is target specific. The files in `src/target/sample` can be used as a template for what code you need to write to integrate with the new operating system. Finally set the variable `$target_base` in the file `setup.pl` in your copied target configuration subfolder to the name of your new subfolder under `src/target`. After this you can build your new target configuration.

### Configure or Change the TargetRTS
Most configuration of the TargetRTS is done at the source code level using preprocessor macros. Each macro implements a specific configuration setting and can get its value from two files:

* `target/<target>/RTTarget.h` Settings specific for the target (e.g. operating system specific settings).
* `libset/<libset>/RTLibSet.h` Settings specific for the libset (e.g. compiler specific settings).

A setting can have a default value in `include/RTConfig.h` which a setting in the above files can override. If needed, you can add your own macros for new configuration settings you need, but in most cases it's enough to change the value of existing settings. Below is a list of the most commonly used configuration settings. Those settings that control if a certain feature should be included in the TargetRTS have the value 1 when the feature is included, and 0 when it's not included.

#### USE_THREADS
Controls if the TargetRTS should use threads. Set to **0** for building a single-threaded version of the TargetRTS or **1** for building a multi-threaded version of it.

Default value: **none** (must be set for a target configuration, usually in `target/<target>/RTTarget.h`)

#### RTS_COUNT
Controls if the TargetRTS should keep track of statistics, such as the number of messages sent, the number of created capsules instances, etc. Collected statistics is saved per thread in the [controller](targetrts-api/class_r_t_controller.html) object. See [RTCounts](targetrts-api/class_r_t_counts.html) for what data that gets collected when this feature is enabled.

Default value: **0** (do not collect statistics)

#### DEFER_IN_ACTOR
When a message is deferred it gets stored in a queue from where it later can be recalled. There can either be one such defer queue per capsule instance or only one defer queue per thread (i.e. stored in the [controller](targetrts-api/class_r_t_controller.html) object). Separate queues for each capsule instance will use more memory but can on the other hand result in better performance.

Default value: **0** (use one defer queue per thread). If your application doesn't use message deferral you should keep this default value.

#### INTEGER_POSTFIX
This is a deprecated setting that controls if the [RTInteger](targetrts-api/class_r_t_integer.html) class should support the increment (++) and decrement (--) operators. The setting is deprecated since use of [RTDataObject](targetrts-api/class_r_t_data_object.html) subclasses for representing primitive types is deprecated. Use a primitive C++ type instead, such as `int`.

Default value: **1** (set to **0** only if you use [RTInteger](targetrts-api/class_r_t_integer.html) and a very old C++ compiler)

#### LOG_MESSAGE
By default a capsule has a function `logMsg()` which gets called when a received message gets dispatched to a capsule instance, just before the message is handled by the capsule's state machine. This is a virtual function that you can override in your capsule to perform any general action needed when a message is dispatched (logging is a common, but not the only example). The default implementation is used by the debugger to log the dispatched message.

Default value: **1** (set to **0** if you don't need this feature and want to slightly improve the performance)

#### OBJECT_DECODE and OBJECT_ENCODE
The TargetRTS contains features that can convert an object to a string representation (encoding) and create an object from a string representation (decoding). It can for example be used when persisting objects from memory to a file or database, when building distributed applications where data needs to be sent between processes or machines, or when using APIs of web services (often JSON).

Default value: **1** (set to **0** if you don't need this feature)

Note that encoding/decoding is controlled by two separate settings since it's possible that you need one but not the other.

#### OTRTSDEBUG
This setting controls the level of debugging support that the TargetRTS will provide. There are 3 possible values:

* **DEBUG_VERBOSE**
Enable all debugger features. For example, it will make it possible to log all delivery of messages, the creation and destruction of capsule instances, etc. But the executable size will be bigger, and there is an impact on performance.
* **DEBUG_TERSE**
Most debugger features are disabled, but some tracing in case of errors is still supported. The size of the executable will be reduced.
* **DEBUG_NONE**
All debugger features are disabled. The size of the executable will be reduced, and performance will be better.

Default value: **DEBUG_VERBOSE**

Note that regardless how you set this setting you can of course always [build the TargetRTS with debug symbols](#debug) to debug it with a C++ debugger.

#### RTREAL_INCLUDED
Controls if the [RTReal](targetrts-api/class_r_t_real.html) class should be included or not. If your target environment doesn't support floating point data types, or your application doesn't use them, you can disable this feature.

Default value: **1**

#### PURIFY
If you use tools for tracking run-time problems such as memory leaks or access violations, for example Purify, you can enable this feature. It will remove some optimizations in the TargetRTS which otherwise can hide some memory allocation and deallocation events from such tools.

Default value: **0**

#### RTS_INLINES
Controls if the TargetRTS uses any inline functions. If enabled, inline functions of classes will be compiled with the class header file. If disabled, they will instead be compiled from a special file `inline.cc` which most classes have.

Default value: **1** (set to **0** if you use an old compiler without proper support for inline functions)

#### RTS_COMPATIBLE
This setting is used for controlling backwards compatibility in the TargetRTS. It corresponds to the version number `RT_VERSION_NUMBER` which is defined in the file [`RTVersion.h`](targetrts-api/_r_t_version_8h_source.html).

Default value: **520**. This is a very old version of the TargetRTS, but it means that by default certain deprecated code gets included to make the TargetRTS compatible for old applications that use it. If you set it to `RT_VERSION_NUMBER`, then such deprecated code will not be included which will slightly reduce the size of the executable.

#### HAVE_INET
Controls if the TargetRTS can use TCP/IP. This is required for certain features such as debugging.

Default value: **1** (set to **0** if your target environment doesn't provide TCP/IP support)

#### INLINE_METHODS
The member functions in a generated capsule class that contain user-defined code, such as transition or guard code, will be declared with this macro. You can set it to `inline` if you want those function to be declared as inline functions. This may (or may not, depending on compiler) improve the performance, but may also lead to a larger executable.

Default value: **none**

#### RTFRAME_CHECKING
This setting is used when you call functions on a [Frame](../targetrts-api/struct_frame.html) port, for example to destroy a capsule instance in a part. The recommendation is to declare [Frame](../targetrts-api/struct_frame.html) ports as non-service ports, so they only can be used internally by the owning capsule itself. However, if you somehow make a [Frame](../targetrts-api/struct_frame.html) port accessible for other capsules, they must at least be run by the same thread as the capsule that owns the [Frame](../targetrts-api/struct_frame.html) port.

The following values are possible for this setting:

* **RTFRAME_CHECK_STRICT** (this is the default value)

Perform a run-time check that a [Frame](../targetrts-api/struct_frame.html) port is only used by the capsule that owns it.

* **RTFRAME_CHECK_LOOSE**
  
Perform a run-time check that a [Frame](../targetrts-api/struct_frame.html) port is only used by code that runs in the same thread as the capsule that owns it.

* **RTFRAME_CHECK_NONE**

Do not perform a run-time check. It improves the application performance slightly, and can be safely set if all [Frame](../targetrts-api/struct_frame.html) ports are only used by the capsule that owns them.

#### RTFRAME_THREAD_SAFE 
This setting is used when you call functions on a [Frame](../targetrts-api/struct_frame.html) port, for example to create or destroy a capsule instance in a part. By default these functions are thread-safe, which is required when a created or destroyed capsule instance runs in a different thread than the code that calls the functions. However, in certain cases it's possible to optimize the performance by instead using function implementations that are not thread-safe. For example, if you know that you only use [Frame](../targetrts-api/struct_frame.html) ports to operate on capsule instances that run in the same thread as the capsules that owns the ports, then you can disable this setting to improve the application performance.

Default value: **1** (set to **0** if you know it's safe to not use thread-safe implementations of [Frame](../targetrts-api/struct_frame.html) functions)

#### RTMESSAGE_PAYLOAD_SIZE
This setting controls the size of the data area in each message. This data area is used for message data that is small enough, such as integers, booleans and short strings. If the data that is sent with a message is bigger than the specified RTMESSAGE_PAYLOAD_SIZE, then dynamically allocated memory is used for storing the message data outside of the message itself.

Default value: **100** (byte size of the message data area)

Increasing the value will make each message bigger, which makes the application consume more memory, but on the other hand it may become faster since fewer messages will require dynamic memory to be allocated for storing the message data. On the other hand, if your application mostly send very small data objects, you may benefit from decreasing the RTMESSAGE_PAYLOAD_SIZE. You need to fine-tune the value of this setting to find the optimal trade-off between speed and memory consumption for your application.

#### OBSERVABLE
This setting controls if the application will be "observable" at run-time. Target observability includes different kinds of features such as debugging, tracing etc. Disabling this setting will improve application performance and decrease memory consumption, but you will then not be able to use any of the target observability features.

Default value: **1** (set to **0** to disable all target observability features)