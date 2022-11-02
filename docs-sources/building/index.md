Art and C++ files can be built into applications or libraries. The build process consists of three steps:

1. **Generate source files**
In this step Art files are translated to C++ source files. 

2. **Generate a make file**
A make file for building generated C++ code (and possibly also other C++ code) is generated.

3. **Run make to generate binaries**
A make tool is invoked for building an executable or library from the generated make file.

All these steps require information which is stored in a [transformation configuration](transformation-configurations.md) (TC for short). It is a text file which contains various properties needed for translating Art elements to C++ code, for generating the make file, and finally for launching the make tool. You can have more than one TC in your workspace, but at most one TC in each workspace folder can be **active**. Set a TC as active by right-clicking on it and perform the command **Set as Active**. An active TC is marked with a checkmark.

![](images/active-tc.png)

Once there is an active TC in a workspace folder, the first step (generation of C++ source files) will happen automatically for all Art files contained in that workspace folder. The C++ code that gets generated is placed in its own workspace folder as specified by the `targetProject` property of the TC. The C++ code in this target workspace folder is then incrementally and automatically updated as soon as any of these Art files are changed. However, to perform the other two steps required for actually building your application, you need to perform the command **Build** which is available in the context menu of the TC. This command will first set the TC as active (if it was not already active) so that C++ code gets generated. It will then generate a make file and finally run the make tool on it.

There are also two other useful commands in the context menu of a TC:

* **Run**
First builds the TC, and then attempts to launch the executable that is produced. The executable is launched in a non-debug mode by specifying the launch argument `URTS_DEBUG=quit`. If you instead want to launch the executable for debugging it you can go to the Terminal and manually launch it from there without any extra arguments. Note that if your TC creates a library rather than an executable, then this command will still build the TC, but will then give an error message since there is no executable to run.

* **Clean**
Removes the target workspace folder produced when building a TC. This means that all generated C++ code, the make file, as well as any produced binaries will be removed. If you only want to remove the binaries you can instead go to the Terminal and invoke `make clean` to clean using the make file.

## Navigation Between Art and Generated C++

## Making Changes in Generated C++

## Building from the Command Line
You can build a TC from the command line by using the [Art compiler](#art-compiler.md).
