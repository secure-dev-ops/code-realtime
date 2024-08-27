It's often useful to print log messages in an application, either as a quick way of trouble shooting a problem without having to use a debugger, or as a more permanent means of reporting errors or other interesting information at runtime. In the latter case it's recommended to use one of the many logging frameworks for C++ that are available. Examples of such frameworks include, but are certainly not limited to:

* [Boost.Log](https://github.com/boostorg/log)
* [Apache Log4cxx](https://github.com/apache/logging-log4cxx)
* [spdlog](https://github.com/gabime/spdlog)

However, for quick and temporary logging needs the TargetRTS includes a simple logging service which you can directly use without the need for a special logging library. This logging service provides a thread-safe way of logging messages and data objects to `stderr`, but not much more than that. 

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
* Use `show()` instead of `log()` to avoid printing a carriage return after the message. Note, however, that all logging functions eventually use the class [RTDiagStream](../targetrts-api/class_r_t_diag_stream.html) for writing in a thread-safe way to `stderr`. To avoid interleaving printouts in a multi-threaded application it can therefore be better to fully create the string to log (for example using `std::stringstream`) and then print it with a single call to `log()`.
* You can print an indented message to the log by calling `crtab()`.
* In addition to strings you can also [log data](#logging-data).

### Logging Data
A log port provides several overloaded versions of `log()` (and `show()`) which lets you log the values of variables. There are overloads for most primitive C++ types, and for some types from the TargetRTS such as `RTString`. You can also log objects of user-defined types, provided that they have a [type descriptor](../art-lang/cpp-extensions.md#type-descriptor). Here is an example of logging a few values of different types:

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

Note that when logging an object of a user-defined type, you must provide the type descriptor as a second argument.

When data is logged like this, the standard [`RTAsciiEncoding`](../targetrts-api/class_r_t_ascii_encoding.html) is often used, which creates a string that often contains both the type of the data, and the value. For the above example, the output will look like this:

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

!!! example
    You can find a sample application that uses a log port for logging data [here]({$vars.github.repo$}/tree/main/art-comp-test/tests/logging). 
    It shows both how data is string encoded by default, and how you can implement a custom encoding by means of `std::stringstream`.

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

