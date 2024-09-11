There is often a need to build several variants of the same application. For example:

* Create a debug versus release build
* Add special instrumentation in order to detect run-time errors such as memory leaks
* Build for multiple target platforms
* Build a test executable for performing unit testing of a capsule.

A variant of an application may often only use slightly different build settings (for example, setting a compiler flag to include debug symbols), but in some cases the application logic may also be somewhat different (for example, use of some code that is specific to a certain target platform). {$product.name$} provides a powerful mechanism, based on scripting, that allows you to build several variants of an application with minimal effort.

## Dynamic Transformation Configurations
A TC is defined using JavaScript which is interpreted when it is built. This opens up for dynamic TC properties where the value of a property is computed at build-time. For simple cases it may be enough to replace static values for TC properties with JavaScript expressions to be able to build several variants of an application. As an example, assume that you want to either build a release or a debug version of an application. The debug version is obtained by compiling the code with the `$(DEBUG_TAG)` flag. The TC can then for example look like this:

``` js
let tc = TCF.define(TCF.ART_TO_CPP);
tc.topCapsule = 'Top';
let system = Java.type('java.lang.System');
let isDebug = system.getenv('DEBUG_BUILD');
tc.compileArguments = isDebug ? '$(DEBUG_TAG)' : '';
```

TCs are evaluated using Nashorn which is a JavaScript engine running on the Java Virtual Machine. This is why we can access a Java class such as `java.lang.System` to read the value of an environment variable. With this TC, and the use of an environment variable `DEBUG_BUILD`, we can now build either a release or a debug version of our application depending on if the environment variable is set or not.

However, defining variants of an application like this can become messy for more complex examples. Setting up several environment variables in a consistent fashion will require effort for everyone that needs to build the application, and perhaps you even need to write a script to manage it. But the biggest problem is that the JavaScript that defines the build variants is embedded into the TC file itself. This makes it impossible to reuse a build variant implementation for multiple TCs. 

## Build Variants Script
A Build Variants script allows to define build variants outside the TC itself. It defines a number of high-level settings, we call them **build variant settings**, each of which is implemented by a separate JavaScript file. There are two kinds of build variant settings that can be defined:

1. **Boolean settings**
These are settings that can either be turned on or off. The "debug" flag we implemented in the example above is an example of a boolean setting.
1. **Enumerated settings**
These are settings that can have a fixed set of values. A list of supported target platforms could be an example of an enumerated setting.

A Build Variants script must have a global function called `initBuildVariants` which defines the build variant settings. Here is an example where one boolean and one enumerated build variant setting are defined:

``` js
// Boolean setting
let isDebug = {
    name: 'Debug',
    script: 'debug.js',
    defaultValue: false,
    description: 'If set, a debug version of the application will be built'
};

// Enumerated setting
let optimization = {
	name: 'Optimization',
	alternatives: [
	  { name: 'HIGH',  script: 'opt.js', args: ['HIGH'],  description: 'Apply all optimizations', defaultValue: true },
   	  { name: 'MEDIUM',  script: 'opt.js', args: ['MEDIUM'],  description: 'Apply some optimizations'},
	  { name: 'OFF', script: 'opt.js', args: ['OFF'], description: 'Turn off all optimizations' }
	]
};

// This function defines which build variant settings that are applicable for a certain TC
function initBuildVariants(tc) {
    BVF.add(isDebug);
    BVF.add(optimization);
}
```

Note the following:

* The `name` property specifies a user-friendly name of the build variant setting.
* Use the `description` property to document what the build variant setting means and how it works.
* In case of an enumerated setting, exactly one of the alternatives should have the `defaultValue` property set. This alternative will be used in case no value is provided for that build variant setting at build-time. For a boolean setting, `defaultValue` should be set to either `true` or `false` depending on if you want the build setting to be turned on or off by default.
* The `script` property specifies the JavaScript file that implements the build variant setting. The path is relative to the location of the Build Variants script (usually they are all placed in the same folder). For a boolean setting the script is only invoked if the setting is set to `true`. For an enumerated setting the script is always invoked, and the value of the enumerated setting is passed as an argument to the script using the `args` property. It's therefore possible (and common) to implement all alternatives of an enumerated setting with the same script.

The `initBuildVariants` function gets the built TC as an argument. You can use it for defining different build variant settings for different kinds of TCs. Here is an example where a build variant setting only is defined for an executable TC:

``` js
function initBuildVariants(tc) {
    if (tc.topCapsule) {
        // Executable TC
        BVF.add(linkOptimization);
    }
    else {
        // Library TC
    }
}
```

## Build Variant Setting Script
A script that implements a build variant setting is invoked twice when a TC is built. The first time a function `preProcess` gets called, and the second time a function `postProcess` gets called. You can define either one or both of these functions depending on your needs.

### preProcess Function
If a `preProcess` function exists it will be called before the built TC is evaluated. Therefore you cannot access the TC in this function. The only input to the function is the script arguments, as defined by the `args` property for an enumerated setting. The main reason for implementing a `preProcess` function is to compute some data based on a build variant setting. Such data can be stored globally and later be accessed when `postProcess` gets called or in a TC file when setting the value of a TC property. Here is an example:

``` js
function preProcess( targetPlatform ) {
	MSG.formatInfo("Building for target platform %s", targetPlatform);
	TCF.globals().targetPlatform = targetPlatform;
	if (targetPlatform == 'Win64_MSVS') {
		TCF.globals().targetCompiler = 'MSVS';
        MSG.formatInfo("Building with Microsoft Visual Studio Compiler");		
	} else {
		TCF.globals().targetCompiler = 'GCC';		
        MSG.formatInfo("Building with GNU Compiler");
	}
}
```
Here we use the [`MSG` object](#msg-object) for printing messages to the build log and we use the [`TCF` object](#tcf-object) for storing globally some data that we have computed based on the build variant setting. Remember that the [`TCF` object](#tcf-object) also is available in a TC file, which means that TC properties may access the stored global data.

### postProcess Function
If a `postProcess` function exists it will be called after the built TC has been evaluated. The function gets the built TC as an argument, as well as all its prerequisite TCs. For an enumerated setting it also gets the script arguments as defined by the `args` property. The function can directly modify properties of both the built TC and all its prerequisites. The property values that the TCs have when the function returns are the ones that will be used in the build. Hence this function gives you full freedom to customize all TC properties so that they have values suitable for the build variant setting. Here is an example that uses the global data computed in the `preProcess` function above:

``` js
function postProcess(topTC, allTCs, targetPlatform) {	
	for (i = 0; i < allTCs.length; ++i) {
	  if (TCF.globals().targetCompiler == 'MSVS') {
		allTCs[i].compileCommand = 'cl';
	  }
	  else if (TCF.globals().targetCompiler == 'GCC') {
		allTCs[i].compileCommand = 'gcc';
	  }	  	  
	}
	if (targetPlatform == 'MacOS') {
	    MSG.formatWarning("MacOS builds are not fully supported yet");	  
	}
}
```
Also in this function we can use the [`TCF`](#tcf-object) and [`MSG`](#msg-object) objects to access global data and to print messages to the build log. But most importantly, we can directly write the properties of the `topTC` (the TC that is built) and/or `allTCs` (the TC that is built followed by all its prerequisite TCs). 

By modifying the [compileArguments](transformation-configurations.md#compilearguments) TC property the build variant setting script can set preprocessor macros in order to customize the code that gets compiled. Hence we can both customize *how* the application is built, and also *what* it will do at run-time. This makes Build Variants a very powerful feature for building variants of an application, controlled by a few well-defined high-level build variant settings.

!!! example
    You can find a sample application that uses build variants [here]({$vars.github.repo$}/tree/main/art-comp-test/tests/build_variants).

## Build Configuration
When building a TC that uses build variants you need to provide values for all build variant settings, except those for which you want to use their default values. These values are referred to as a **build configuration**. You can only specify a build configuration when building with the [Art Compiler](art-compiler.md). When building from within the IDE, all build variant settings will get their default values.

Specify the build configuration by means of the [--buildConfig](art-compiler.md#buildconfig) option for the Art Compiler. A boolean build variant setting is set by simply mentioning the name of the setting in the build configuration. To set an enumerated build variant setting use the syntax `setting=value`. Separate different build variant settings by semicolons. For the sample build variants script above, with one boolean and one enumerated build variant setting, a build configuration can look like this:

`--buildConfig="Debug;Optimization=MEDIUM"`

## JavaScript API
Build variant scripts are implemented with JavaScript and run on a Java Virtual Machine (JVM) by means of an engine called [Nashorn](https://github.com/openjdk/nashorn). It supports all of ECMAScript 5.1 and many things from ECMAScript 6. Since it runs on the JVM you can access Java classes and methods. See the Nashorn documentation to learn about these possibilities.

In addition to standard JavaScript and Java functionality, a build variant script can also use an API provided by {$product.name$}. This API consists of a few JavaScript objects and functions. Note that there are three different contexts in which JavaScript executes in {$product.name$} and not all parts of the API are available or meaningful in all contexts.

1. **Evaluation of a TC**:
TCs are evaluated when they are built, but also in order to perform validation of TC properties, for example while editing the TC. JavaScript in a TC file has access to the [TCF object](#tcf-object). Typically on the first line in a TC it's used like this: `let tc = TCF.define(TCF.ART_TO_CPP);`.
Since TCs are evaluated frequently all JavaScript it contains should only compute what it necessary for setting the values of TC properties. It should not have any side-effects, and should not print any messages.

2. **Build Variants script**:
A build variants script is evaluated when building a TC with the [Art Compiler](art-compiler.md). This evaluation happens early with the purpose of deciding which build variant settings that are applicable for the build. You can use the [BVF object](#bvf-object) in a build variants script.

3. **Build Variant Setting script**:
A build variant setting script is evaluated when building a TC with the [Art Compiler](art-compiler.md). It's evaluated twice as explained [above](#build-variant-setting-script). You can use the [MSG](#msg-object) and [TCF](#tcf-object) objects in a build variant setting script.

### BVF Object
This object provides a "Build Variant Framework" with functions that are useful when implementing a Build Variants script. The object is only available in that kind of script.

#### BVF.add
`add(...buildVariantSettings)`

Adds one or several build variant settings to be available for the current build. Each build variant setting is represented by a JavaScript object that either describes a boolean or enumerated setting as explained [above](#build-variants-script).

#### BVF.addCommonUtils
`addCommonUtils(...commonUtils)`

If you implement utility functions that you want to use from several scripts you can make them globally available by means of this function. For example:

``` js
let myUtils = {
  name: 'My utils', // Any name
  script: 'myUtils.js' // Script that contains global utility functions
}
function initBuildVariants(tc) {
  BVF.addCommonUtils(myUtils);
  // ...
}
```

All functions defined in "myUtils.js" will now be available to be used by build variant setting scripts.

#### BVF.formatInfo
`formatInfo(msg,...args)`

Prints an information message to the build log. This function works the same as [MSG.formatInfo](#msgformatinfo).

#### BVF.formatWarning
`formatWarning(msg,...args)`

Prints a warning message to the build log. This function works the same as [MSG.formatWarning](#msgformatwarning).

#### BVF.formatError
`formatError(msg,...args)`

Prints an error message to the build log. This function works the same as [MSG.formatError](#msgformaterror). Note that the Art Compiler will stop the build if an error is reported.

### MSG Object
This object provides functions for writing messages to the build log. Each function takes a message and optionally also additional arguments. The message may contain placeholders, such as %s, that will be replaced with the arguments. You must make sure the number of arguments provided match the number of placeholders in the message, and that the type of each argument matches the type of placeholder (e.g. %s for string).

The MSG object is only available in a build variant setting script.

#### MSG.formatInfo
`formatInfo(msg,...args)`

Prints an information message to the build log. Example:

``` js
MSG.formatInfo("Building for target platform %s", targetPlatform);
```

#### MSG.formatWarning
`formatWarning(msg,...args)`

Prints a warning message to the build log. 

#### MSG.formatError
`formatError(msg,...args)`

Prints an error message to the build log. Note that the Art Compiler will stop the build if an error is reported.

### TCF Object
This object provides a "Transformation Configuration Framework". It is available in a build variant setting script and also in a TC file.

#### buildVariantsFolder
`buildVariantsFolder() -> String`

Returns the full path to the folder where the build variants script is located.

#### buildVariantsScript
`buildVariantsScript() -> String`

Returns the full path to the build variants script.

#### define
`define(descriptorId) -> {TCObject}`

Creates a new TC object. This function is typically called in the beginning of a TC file to get the TC object whose properties are then set. 

#### getTopTC
`getTopTC() -> {TCObject}`

Returns the top TC, i.e. the TC that is built. You can use this from a prerequisite TC to access properties set on the top TC. For example, it allows a library TC to set some of its properties to have the same values as are used for the executable TC. This can ensure that a library is built with the same settings that are used for the executable that links with the library. Here is an example of how a library TC can be defined to ensure that it will use the same target configuration as the executable that links with it:

``` js
let tc = TCF.define(TCF.ART_TO_CPP);
let topTC = TCF.getTopTC().eval; // eval returns an evaluated TC object, where all properties have ready-to-read values (even for properties with default values)
tc.targetConfiguration = topTC.targetConfiguration;
```

#### globals
`globals() -> {object}`

Returns an object that can store global data needed across evaluations of different JavaScript files. For an example, see [above](#build-variant-setting-script).

#### orderedGraph
`orderedGraph(topTC) -> [{TCObject}]`

Traverses all prerequisites of a TC (`topTC`) and returns an array that contains them in a depth-first order. The last element of the array is the top TC itself. The function also ensures that all prerequisite TCs are loaded.

``` js
var prereqs = TCF.orderedGraph(tc);
for (i = 0; i < prereqs.length; ++i) {
   var arguments = prereqs[i].compileArguments;
   // ...
}
```
