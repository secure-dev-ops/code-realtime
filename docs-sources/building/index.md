Art and C++ files can be built into applications or libraries. The build process consists of three steps:

1. **Generate source files**
In this step Art files are translated to C++ source files. 

2. **Generate a make file**
A make file for building generated C++ code (and possibly also other C++ code) is generated.

3. **Run make to generate binaries**
A make tool is invoked for building an executable or library from the generated make file.

All these steps require information which is stored in a [transformation configuration](transformation-configurations.md) (TC for short). It is a text file which contains various properties needed for translating Art elements to C++ code, for generating the make file, and finally for launching the make tool. You can have more than one TC in your workspace, but at most one TC in each workspace folder can be **active**. Set a TC as active by right-clicking on it and perform the command **Set as Active**. An active TC is marked with a checkmark.

![](images/active-tc.png)

Once there is an active TC in a workspace folder, the first and second steps (generation of C++ source files and make file) will happen automatically for all Art files contained in that workspace folder. The files that get generated are placed in its own workspace folder as specified by the `targetProject` property of the TC. The C++ code in this target workspace folder is then incrementally and automatically updated as soon as any of these Art files are changed. Also the make file (which by default is placed in a subfolder called `default` in the target workspace folder) gets updated when needed. Below is an example of a simple target workspace folder.

![](images/target-workspace-folder.png)

To perform the third step (running make to generate binaries) you can simply go to the Terminal and invoke the command `make`. For convenience there is also a command **Build** available in the context menu of a TC. This command will first set the TC as active (if it was not already active) so that C++ code and a make file get generated. It will then run the make tool on the generated make file. All messages such as compilation errors will appear in the Terminal.

There are also two other useful commands in the context menu of a TC:

* **Run**
First builds the TC, and then attempts to launch the executable that is produced. The executable is launched in a non-debug mode by specifying the launch argument `-URTS_DEBUG=quit`. If you instead want to launch the executable for debugging it you can go to the Terminal and manually launch it from there without any extra arguments. Note that if your TC creates a library rather than an executable, then this command will still build the TC, but will then give an error message since there is no executable to run.

* **Clean**
Removes the target workspace folder produced when building a TC. This means that all generated C++ code, the make file, as well as any produced binaries will be removed. If you only want to remove the binaries you can instead go to the Terminal and invoke `make clean` to clean using the make file.

## Navigation Between Art and Generated C++
You can navigate from an element in an Art file to the corresponding element in the C++ file that gets generated from that Art file. Use the context menu that appears when you right-click on an element in an Art file and invoke the command **Open Generated Code**. If C++ code has not yet been generated for the Art file, for example because no active TC has been set, navigation will fail with an error message.

When navigating to generated C++ code an attempt is made to put the cursor as close as possible to the relevant C++ element. However, when there is no C++ element that directly corresponds to the selected Art element, the cursor may instead be placed on a container C++ element. If there are more than one C++ element generated from a single Art element, you will be prompted for where to navigate. For example:

![](images/multiple-cpp-elements-navigation.png)

For C++ code snippets you can as an alternative perform the navigation using a tooltip that appears when you hover over the code snippet:

![](images/navigate-cpp-tooltip.png)

If the cursor is within the C++ code snippet when navigating, the cursor will be set at the same place in the generated C++ code. This is convenient if you start to edit a code snippet in an Art file but later realize that you instead want to edit it in the generated C++ code instead.

## Making Changes in Generated C++

## Building from the Command Line
You can build a TC from the command line by using the [Art compiler](art-compiler.md).
