Once you have successfully [built an application](../building/index.md) the next step is usually to run it. If you built the application for the same machine architecture as where {$product.name$} runs you can launch it on your local machine. You can do this

1. from the [TC context menu](../building/index.md#tc-context-menu-commands)
2. from the [Run link](../building/index.md#building-and-running-without-a-tc) in the Art editor (in case you didn't yet create a TC)
3. by means of a [launch configuration](launch-configurations.md)

Options 1 and 2 are convenients way to quickly run an application, but for full control over how to launch the application you should go for the 3rd option. In the [launch configuration](launch-configurations.md) you can for example specify custom command-line arguments and set environment variables for the launched application.

A [launch configuration](launch-configurations.md) is also needed in case you want to [debug](debugging.md) the application with the Art Debugger. Doing so can help in troubleshooting problems (often combined with traditional C++ debugging), but can also be useful as a means to interact with an unfinished application that is still under development. For example, the Art Debugger lets you manually [send events](debugging.md#send-event) to the debugged application on ports that may not yet be connected (because you didn't yet implement the sending capsule).

Often you may not want to run the application locally, and it will not even be possible if the application was built for a different machine architecture. In that case you can launch the application from the command-line on the target machine, and then [attach](debugging.md#attach) the Art Debugger to it. Thereby you can debug the application remotely in the same way as if it was running locally.