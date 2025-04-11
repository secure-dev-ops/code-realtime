It's often useful to print log messages in an application, either as a quick way of troubleshooting a problem without having to use a debugger, or as a more permanent means of reporting errors or other interesting information at runtime. In the latter case you can use one of the many logging frameworks for C++ that are available. Examples of such frameworks include, but are certainly not limited to:

* [Boost.Log](https://github.com/boostorg/log)
* [Apache Log4cxx](https://github.com/apache/logging-log4cxx)
* [spdlog](https://github.com/gabime/spdlog)

However, the TargetRTS also includes a simple logging service which you can directly use without the need for a special logging library. This logging service provides the basics for logging messages and data objects in a thread-safe way to `stderr`, `stdout` or a log file.

## Log Port
A capsule can access the logging service by means of a log port, which is a port typed by the predefined [`Log`](../targetrts-api/struct_log.html) protocol. Log ports should be non-service behavior ports, and don't accept any events, but rather provide a [set of functions](../targetrts-api/class_log_1_1_base.html) which the capsule can call for logging messages. Here is an example of a capsule which uses a log port for writing an error message if the initial transition does not receive an expected data object:

```art
capsule C {
    behavior port log : Log;

    statemachine {
        state S;
        initial - State1
        `
            if (rtdata == nullptr) {
                log.log("Missing initialization data for capsule C");
                log.commit();
            }
        `;
    };
};
```

Note the following:
  
* To flush the log and make sure the logged message becomes visible you must call `commit()`.
* Use `show()` instead of `log()` to avoid printing a carriage return after the message. 
* You can print an indented message to the log by calling `crtab()`.
 
Using a log port comes with certain limitations:

* Since ports only can be added to capsules, you can only use log ports in code that is located in a capsule.
* Log ports only let you log messages to `stderr`.
* Logging with log ports is thread-safe but if you want to log bigger messages by making several calls to `show()` or `log()` from different threads, the log messages could be interleaved on `stderr`. This is because all logging functions eventually use the class [RTDiagStream](../targetrts-api/class_r_t_diag_stream.html) for writing in a thread-safe way to `stderr`. You can avoid interleaving printouts in a multi-threaded application by first creating the string to log (for example using `std::stringstream`) and then print it with a single call to `log()` or `show()`. 
* While you can log not only strings but also [log data](#logging-data-with-a-log-port) by calling different overloads of `show()` and `log()`, the type of the data will be printed before the value. This may or may not be desirable.

If any of these limitations is a concern, you can use a [log stream](#log-stream) instead of a log port.

### Logging Data with a Log Port
A log port provides several overloaded versions of `log()` (and `show()`) which lets you log the values of variables. There are overloads for most primitive C++ types, and for some types from the TargetRTS such as `RTString`. You can also log objects of user-defined types, provided that they have a [type descriptor](../art-lang/cpp-extensions.md#type-descriptor). Here is an example of using a log port called `log` for logging a few values of different types:

```cpp
struct [[rt::auto_descriptor]] MyType {
    int x = 0;
    int y = 0;
};

// ...

int x = 14;
RTString s = "Hello!";
MyType mt; // User-defined type with a type descriptor

log.log(x); // Calls Log::Base::log(int)
log.log(s); // Calls Log::Base::log(const RTString&)
log.log(&mt, &RTType_MyType); // Calls Log::Base::log(const void*, RTObject_class*)
```

Note that when logging an object of a user-defined type, you must provide the type descriptor as a second argument to `log()` or `show()`.

When data is logged like this, the standard [`RTAsciiEncoding`](../targetrts-api/class_r_t_ascii_encoding.html) is used, which creates a string that typically contains both the type of the data, and the value. For the above example, the output will look like this:

```
int 14
Hello!
MyType{x 0,y 0}
```

If you want to encode data differently when logging, you can construct a string with `std::stringstream` and then log it. For example:

```cpp
std::stringstream ss;
ss << x << " " << s.Contents << " " << mt;
log.log(ss.str().c_str());
```

To allow a user-defined type to be handled by `std::stringstream` you need to implement the global `operator<<` for it. For example:

```cpp
std::ostream& operator<< (std::ostream& out, const MyType& mt) {
    out << "[" << mt.x << "," << mt.y << "]"; 
    return out;
}
```

With this implementation, the data will instead be logged like this:

```
14 Hello! [0,0]
```

See also [Logging Data with a Log Stream](#logging-data-with-a-log-stream).

!!! example
    You can find a sample application that uses a log port for logging data [here]({$vars.github.repo$}/tree/main/art-comp-test/tests/logging). 
    It shows both how data is string encoded by default, and how you can implement a custom encoding by means of `std::stringstream`.


## Log Stream
An alternative to logging with a log port is to use a log stream. The [`Log`](../targetrts-api/struct_log.html) struct has a nested class `Log::Stream` which lets you write log messages either to a text file or an `ostream` such as `std::cout` and `std::cerr`. You can write text or data to a log stream using the C++ insertion operator (`<<`).

For simplicity `Log` also has two members `out` and `err` which can be directly used for streaming log messages to `stdout` or `stderr`. Here are some examples of using log streams:

```cpp
Log::Stream out(&Log::out); // Log stream connected to stdout
out << "Some data to stdout" << Log::endl; 
Log::Stream err(&std::cerr); // Log stream connected to stderr
out << "Some data to stderr" << Log::endl;

Log::out << "info" << Log::endl; // Alternative to write to stdout
Log::err << "error" << std::endl; // Alternative to write to stderr

Log::Stream logfile("log1.txt"); // Log stream connected to a text file (overwrites if it already exists)
logfile << "log text" << Log::endl;
Log::Stream logfile2("log2.txt", false); // Log stream connected to a text file (appends if it already exists)
logfile2 << "another log text" << std::endl;
```

`Log::endl` will print a newline and flush the log stream. It's also possible to use the standard `std::endl` with the same result. 

When you connect a log stream to a file you can either use an absolute or a relative path. A relative path will be interpreted against the current working directory (by default the location of the built executable). If the specified log file already exists you can choose if you want to append to or overwrite its contents (by default it will overwrite).

### Logging Data with a Log Stream
With a log stream data can be logged in the same way as when using standard C++ stream objects. In fact, the log stream internally uses an `std::ostream`. This means that you can use all the standard manipulators to control how to format the data. Here are some examples:

```cpp
Log::out << "int: " << 5 << Log::endl; 
bool b = true;
Log::out << b << Log::endl;
Log::out << std::boolalpha << b << Log::endl; 
double pi = 3.14159;
Log::out << std::setprecision(2) << pi << Log::endl; 
Log::out << std::setprecision(3) << std::scientific << pi << Log::endl; 
std::string world = "world";
Log::out << "hello" << std::setw(10) << world << Log::endl;
```

The output will look like this:

```
int: 5
1
true
3.1
3.142e+00
hello     world
```

To log data of a user-defined type you need to provide the data object and its type descriptor by means of an [`RTTypedValue`](../targetrts-api/struct_r_t_typed_value.html) object. For example:

```cpp
struct [[rt::auto_descriptor]] MyType {
    int x = 1;
    int y = 2;
};

// ...
MyType mt;
Log::out << "MyType value: " << RTTypedValue(&mt, &RTType_MyType) << Log::endl;
```

Just like when [logging data with a log port](#logging-data-with-a-log-port) the value of the user-defined type will be encoded using the standard [`RTAsciiEncoding`](../targetrts-api/class_r_t_ascii_encoding.html), so the output will look like this:

```
MyType value: MyType{x 1,y 2}
```

### Locking and Unlocking Log Streams
If you use a log stream from multiple threads, log messages could become interleaved when printed. To prevent this you can lock the log streams before logging a message, and then unlock them afterwards. While the log streams are locked by a thread, other threads that attempt to lock them will be blocked until the log streams are unlocked again. This is hence a simple way to give a certain thread exclusive thread-safe access to the log streams so it can fully print a certain log message, without risk that other threads write something to the log streams at the same time.

As an example, assume a message is logged to `stderr` by printing three separate strings:

```cpp
Log::err << "This is a compound log message, " << "printed by thread " << context()->name() << Log::endl; 
```

If this piece of code runs at the same time from multiple threads, the messages could be interleaved, because there can be a thread context switch after the printing of each substring. For example, the logged messages could look like this:

```
This is a compound log message, printed by thread Thread4
This is a compound log message, This is a compound log message, printed by thread Thread2
printed by thread Thread1
This is a compound log message, printed by thread Thread3
```

To avoid this you can use `Log::lock` before we start to log the message, and `Log::unlock` after it has been logged:

```cpp
Log::err << Log::lock << "This is a compound log message, " << "printed from thread " << context()->name() << Log::endl << Log::unlock; 
```

Note the following:

* Locking/unlocking applies to *all* log streams at the same time. That is, if you lock/unlock `Log::err`, then `Log::out` is also locked/unlocked and vice versa. And the same happens if you lock/unlock a `Log::Stream` object.
* Calls to `Log::lock` and `Log::unlock` should always be balanced.
* To avoid performance problems you should not print too many log messages while the log streams are locked. Printing a single sentence followed by `Log::endl` can be a good compromise between performance and log readability.

!!! example
    You can find a sample application that uses a log stream and locks/unlocks it for thread-safe logging of compound log messages to `stdout` and `stderr` [here]({$vars.github.repo$}/tree/main/art-comp-test/tests/log_stream).
    A sample application that uses log streams for logging to files can be found [here]({$vars.github.repo$}/tree/main/art-comp-test/tests/log_file_stream).


## TargetRTS Error Logging
The TargetRTS itself uses logging to `stderr` to report run-time errors that may happen when your application runs. In a correctly implemented application there of course should not be any such error messages reported, but while the application is developed and still contains bugs, it's useful to be informed about run-time problems when they do occur.

For example, assume you have a fixed capsule part `p` in capsule `Top`, and try to create a capsule instance dynamically in `p` by calling `incarnate()` on a [Frame](../targetrts-api/struct_frame.html) port. This is an error, since a fixed capsule part gets automatically incarnated with all capsule instances it can contain (according to its multiplicity) already when the container capsule instance is created. After that the fixed capsule part is "full" and cannot contain any more capsule instances. The TargetRTS reports this error by logging this message:

```
incarnate(application(Top)<<machine>>.p[-1]): Reference full.
```

In addition to the actual error message ("Reference full") the text contains information that helps you identify the source of the problem. For this situation:

* `incarnate` The TargetRTS function that was called when the error occurred.
* `application` The capsule part in which the error occured. The special name `application` denotes the implicit part in which the top capsule instance is located, i.e. the very root of the capsule instance tree.
* `Top` The type (i.e. capsule) of the capsule part in which the error occurred.
* `<machine>` The state of the capsule state machine that is currently active when the error occurred. The special name `<machine>` denotes the implicit state that is active before the first state is activated (i.e. if the error occurs in the initial transition).
* `p` The capsule part that could not be incarnated.
* `-1` The index at which a new capsule instance was attempted to be incarnated. -1 means it was not specified and the first "free" index would be used.

Other error messages may provide other types of information, but many use the same or a similar format for specifying the capsule part, capsule and active state.

Let's look at another common run-time error which occurs if a capsule receives an event which doesn't trigger a transition in its state machine (typically because you forgot to create a transition with a matching trigger for the event). In this case [RTActor](../targetrts-api/class_r_t_actor.html)::`unexpectedMessage()` gets called and prints information that can help you understand what happened. Here is an example of what such a log message may look like:

```
engine(1)@TOP::Waiting received unexpected message: wheel[2]%alarm data: RTString"FATAL"
```

This text means that a message for the event `alarm` was received on the port `wheel` at index 2. The message carried a string parameter with the value `FATAL`. When the message was dispatched to the capsule instance, its state machine was in the state `Waiting` (which is a substate of `TOP`). The capsule instance is located in a part `engine` at index 1. All indices here are 1-based.

### Retrieving the Most Recent Error
In addition to logging run-time errors, the TargetRTS also stores the most recently occurred error in the [RTController](../targetrts-api/class_r_t_controller.html). This means that for every thread in the application, you can find out the most recent error that occurred in one of the capsule instances that are run by that thread. Errors are identified by literals from the [RTController](../targetrts-api/class_r_t_controller.html)`::Error` enumeration. If no error has occurred, the `ok` literal (with value 0) is used.

You can access the most recent error either by calling [RTController](../targetrts-api/class_r_t_controller.html)::`getError()`, or directly from capsule context by calling [RTActor](../targetrts-api/class_r_t_actor.html)::`getError()`.

The typical use case when retrieving the most recent error is useful, is when you call a TargetRTS function that fails, but not because of a problem in the application itself, but perhaps because of a problem in the environment, such as an out-of-memory situation. Most TargetRTS functions indicate failure by returning 0 (and success by returning 1). In some cases the function may return an object on which you can call a function such as `isValid()` to check for success.

If you detect that a function failed, you can find out more information by retrieving the most recent error. Note that you have to do this immediately after the failing function returns, since only the last occurred error is stored. If you return from your code snippet, the TargetRTS will invoke a transition of another capsule managed by the same controller, which would overwrite the stored error if another error occurs (since that then would be the most recent error).

Here is an example of how to check if an event could not be sent, and if so, retrieve the error that explains why it failed:

```cpp
if (!p.myEvent().send()) {
    RTController::Error error = getError();
    if (error == RTController::noMem) { 
        /* out of memory */
        context()->perror("Out of memory");
    }
}
```

The function [RTController](../targetrts-api/class_r_t_controller.html)::`perror()` prints the error message to `stderr` with a custom prefix. If you want to access the error message without printing it, you can call [RTController](../targetrts-api/class_r_t_controller.html)::`strerror()`.

