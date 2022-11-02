Art and C++ files can be built into applications or libraries. The build process consists of three steps:

1. **Generate source files**
In this step Art files are translated to C++ source files. 

2. **Generate a make file**
A make file for building generated C++ code (and possibly also other C++ code) is generated.

3. **Run make to generate binaries**
A make tool is invoked for building an executable or library from the generated make file.

All these steps require various information which is stored in a [transformation configuration](transformation-configurations.md) (TC for short). It is a text file which contains various properties needed for translating Art elements to C++ code, for generating the make file, and finally for launching the make tool. Once you have created a TC and set it as active in {{product.name}}, the first step happens automatically and generated C++ code is incrementally and automatically updated as soon as an Art file is changed. However, to perform the other two steps required for actually building your application, you need to perform the command **Build** which is available in the context menu of the TC. This command will first set the TC as active (if it was not already active).

There are also two other useful commands in the context menu of a TC:

* **Run**
First builds the TC, and then attempts to launch the executable that is produced. If your TC creates a library rather than an executable, then this command will give an error message.

* **Clean**
Removes all generated C++ code and make file, as well as any produced binaries. If you only want to remove the binaries you can instead go to the Terminal and invoke `make clean`.

## Navigation Between Art and Generated C++

## Making Changes in Generated C++

## Building from the Command Line
You can build a TC from the command line by using the [Art compiler](#art-compiler.md).
