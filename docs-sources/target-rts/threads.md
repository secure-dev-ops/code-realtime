An Art application consists of capsule instances that each manage a state machine and communicates with other capsule instances by sending and receiving events. Conceptually we can think about each capsule instance as run by its own thread.

![](../art-lang/images/event_queues.png)

However, in practise it's often necessary to let each thread run more than one capsule instance. The number of capsule instances in an application can be higher than the maximum number of threads the operating system allows per process. And even if that is not the case, having too many threads can consume too much memory and lead to unwanted overhead.

When creating a new Art application it's recommended to start with a minimal number of threads, perhaps only the main thread initially. During the design work you will then add new threads when you identify capsules that need to perform long-running tasks. Such a capsule should not run in the main thread since during the long-running task all other capsules run by that thread will be unresponsive (i.e. cannot respond to incoming events).

Another input to which threads to use is how capsule instances communicate with each other. Those capsule instances that communicate frequently with each other benefit from being run by the same thread since sending an event within the same thread is faster than sending it across threads.

## Physical and Logical Threads
{$product.name$} makes a difference between physical and logical threads. Physical threads are the real threads that exist in the application at run-time. A logical thread is a conceptual thread which application code uses when it needs to refer to a thread. Hence, it is an indirection which prevents hard-coding the application against certain physical threads. 

Logical and physical threads are defined in the transformation configuration (TC) using the [threads](../building/transformation-configurations.md#threads) property. Each logical thread is mapped to a physical thread. Having all information about threads in the TC has several benefits:

* You can change the thread configuration of an application without changing any C++ code.
* You can have multiple TCs with different thread configurations for the same application. Some operating systems have a lower limit for the number of threads per process than others.
* It becomes easy to quickly see which threads will exist at run-time as opposed to if such information is embedded into the C++ code.
* It becomes easy to experiment with different thread configurations for an application to explore which one gives the best performance.

To ensure that each logical thread is mapped to a physical thread, the logical threads are defined implicitly when they are mapped to a physical thread. Here is an example where there are two physical threads `MainThread` and `PT1`, and three logical threads `L1`, `L2` and `L3`. The logical threads `L1` and `L2` are both mapped to the `MainThread` while `L3` is mapped to `PT1`. 

``` js
tc.threads = [
{
    name: 'MainThread',
    implClass: 'RTPeerController',
    stackSize: '20000',
    priority: 'DEFAULT_MAIN_PRIORITY',
    logical: [
        'L1', 'L2'
    ]
},
{
    name: 'PT1',
    implClass: 'RTPeerController',
    stackSize: '20000',
    priority: 'DEFAULT_MAIN_PRIORITY',
    logical: [
        'L3'
    ]
}
];
```

Take care to map a logical thread to exactly one physical thread.

## Running a Capsule Instance in a Custom Thread
Capsule instances are connected in a tree structure where the top capsule is the root. A capsule instance always lives inside a part of another (container) capsule. The top capsule instance is always run by the main thread, but for all other capsule instances you can choose which thread that should run it.

When a new capsule instance is created it will by default be run by the same thread that runs the container capsule instance. This means that by default all capsule instances in the application will be run by the main thread.

The example below illustrates the capsule instances of an Art application. `C1` is the top capsule. For simplicity we have assumed that all capsule parts are fixed with multiplicity 1 so they only can contain one capsule instance.

![](../images/thread_mappings.png)

The capsule instances contained in `cp1` and `fp1` are run by the logical thread `Logical1` while the capsule instances contained in `dp1`, `cp2` and `ep2` are run by the logical thread `Logical2`. Other capsule instances are run by the main thread. Note that to accomplish that we need to explicitly reference the `MainThread` when incarnating `ep1` since by default it would be run by the thread that runs its container capsule, i.e. `Logical2`. In fact we need to explicitly mention a logical thread for all capsule instances in this example except `ep2` since it runs in the same logical thread as its container capsule instance `cp2`.

If you don't want a capsule instance to be run by the same thread that runs its container capsule you can specify another thread when creating the capsule instance. When incarnating a capsule instance into an optional part this can be done in a call to `incarnate()` on a [Frame](../targetrts-api/struct_frame.html) port. Here is an example:

``` cpp
frame.incarnate(myPart, 0 /* data */, 0 /* type */, LogicalThread, -1);
```

Here `LogicalThread` refers to a logical thread that must exist in the TC. The physical thread to which it is mapped will run the created capsule instance.

If the part is fixed you need to use a [capsule factory](../art-lang/index.md#part-with-capsule-factory) for specifying the thread that should run a capsule instance that is incarnated into the part. For example:

``` art
fixed part server : Server [[rt::create]]
`
    return new Server_Actor(LogicalThread, rtg_ref);
`;
```

## TargetRTS Implementation
The `implClass` property of a physical thread that is defined in a TC refers to the class in the TargetRTS that implements the thread. This class must inherit from [RTController](../targetrts-api/class_r_t_controller.html). A default implementation is provided by the [RTPeerController](../targetrts-api/class_r_t_peer_controller.html). It implements a simple event loop that in each iteration delivers the most prioritized event to the capsule instance that should handle it.

You can implement your own controller class by creating another subclass of [RTController](../targetrts-api/class_r_t_controller.html). As an example, look at [RTCustomController](../targetrts-api/class_r_t_custom_controller.html).

If the application uses timers it needs a timer thread for implementing the timeouts. The TargetRTS provides a default implementation [RTTimerController](../targetrts-api/class_r_t_timer_controller.html) which implements basic support for processing timeout events and timer cancellation.

## Default Threads and Thread Properties
If no threads are specified in the TC the application will use two threads; one main thread that runs all capsule instances and one timer thread that implements support for timers as explained in the documentation of the [threads](../building/transformation-configurations.md#threads) property. If your application is single-threaded and doesn't use timers, it's unnecessary to have a timer thread and you can then remove it by only defining the MainThread in the [threads](../building/transformation-configurations.md#threads) property:

``` js
tc.threads = [
{
    name: 'MainThread',
    implClass: 'RTPeerController',
    stackSize: '20000',
    priority: 'DEFAULT_MAIN_PRIORITY'
}
];
```

A thread object defines a physical thread by means of the following properties:

* **name** The name of the thread. It's recommended to choose a name that describes what the thread is doing. Many C++ debuggers can show the thread name while debugging, and you can also access it programmatically by calling the [RTController](../targetrts-api/class_r_t_controller.html)::name() function.

* **implClass** This is the name of the TargetRTS class that implements the thread. See [TargetRTS Implementation](#targetrts-implementation).

* **stackSize** The thread stack size in bytes. This value is interpreted by the target environment, and some operating systems may have special values (such as 0) that can be used to avoid hard-coding a certain stack size.

* **priority** The thread priority. By default it's `DEFAULT_MAIN_PRIORITY` (or `DEFAULT_TIMER_PRIORITY` for a timer thread). These are macros with values that are interpreted by the target environment.

* **logical** A list of names of logical threads that are mapped to the physical thread. Logical threads must have unique names and each logical thread must only be mapped to one physical thread. Except for the main thread and timer threads this property should not be empty, since it's through the logical threads that the application code can use the physical thread.

## Generated Code for Threads
Thread information specified in the TC is generated into the unit files (by default called `UnitName.h` and `UnitName.cpp`). You will find there functions `_rtg_createThreads()` and `rtg_deleteThreads()` which contain the code for creating and deleting the physical threads that you have added in addition to the default MainThread and TimerThread. There is also a function `_rtg_mapLogicalThreads()` where the logical threads are mapped to physical threads.

Some target environments only support one thread. In this case the macro `USE_THREADS` will be unset when compiling generated C++ code and the TargetRTS, and it will remove all code related to threads. 