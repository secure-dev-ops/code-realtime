Capsules can use timers to get notified when some time has passed. A timer is implemented by means of a port typed by the predefined [`Timing`](../targetrts-api/struct_timing.html) protocol. 

!!! note
    A timer port should always be a non-service behavior port. This is checked by the validation rule [ART_0035](../validation.md#art_0035_timerserviceport).

!!! example
    You can find sample applications that use timers here:
    
    * [One-shot timers]({$vars.github.repo$}/tree/main/art-comp-test/tests/timer_oneshot)
    * [Periodic timers]({$vars.github.repo$}/tree/main/art-comp-test/tests/timer_periodic)

## Set a Timer
When you set a timer you specify the time when it should timeout. At that time the capsule will receive the event `timeout` on the timer port, and it can trigger a transition in the capsule state machine that handles the timeout.

There are three ways to set a timer:

* If you call `informAt` you set a **one-shot timer** that will timeout once, at a specific point in time (absolute time).
* If you call `informIn` you set a **one-shot timer** that will timeout once, when a certain time has passed (relative time). 
* If you call `informEvery` you set a **periodic timer** that will timeout repeatedly at certain intervals (relative time).

The same timer port can be set in any of these ways, and you can "reuse" the timer by setting it again when it has timed out. If you set the same timer multiple times, before it has timed out, you will get multiple timeout events (one for each time the timer was set). 

!!! note
    While it's possible to implement a periodic timer by re-setting a one-shot timer each time it times out, it's not recommended to do so. You will get a higher precision by using a proper periodic timer. This is because it takes some time to set the timer which may add to some drift in the timeouts.

The time specified for a one-shot timer, or interval for a periodic timer, can be specified in three ways:

* Using an [RTTimespec](../targetrts-api/struct_r_t_timespec.html) object that contains the number of seconds and nanoseconds. It can be used both for absolute and relative time. In the former case, it holds the number of seconds and nanoseconds that have passed since 1 January 1970 UTC (known as a Unix timestamp).
* Using an object of type `std::chrono::duration` (for relative time) or `std::chrono::time_point` (for absolute time). You need to include the `<chrono>` header file and use a C++ 11 compiler.
* Using chrono literals that represent an appropriate time unit (e.g. seconds or milliseconds). You need to include the `<chrono>` header file and use a C++ 14 compiler.

All functions that set a timer return an [`RTTimerNode*`](../targetrts-api/class_r_t_timer_node.html), and in case the timer could not be set `nullptr` is returned. It's good practise to always check this return value, to ensure the timer was successfully set. If you later need to operate on the timer (for example to [cancel it](#cancel-a-timer)) you should construct an [`RTTimerId`](../targetrts-api/class_r_t_timer_id.html) object from the [`RTTimerNode*`](../targetrts-api/class_r_t_timer_node.html). You can then call `isValid()` on that object to make sure the timer was successfully set. 

The example below shows some different ways to set timers and to handle the timeouts:

```art
capsule Timers {
    behavior port timer1 : Timing, timer2 : Timing, timer3 : Timing; 

    statemachine {
        state S {
            timeout : on timer1.timeout, timer2.timeout, timer3.timeout
            `
                // TODO: Handle timeouts here
            `;
        };

        initial -> S
        `
            RTTimerId tid1 = timer1.informIn(RTTimespec(2, 0)); // one-shot timer to time out in 2 s
            if (!tid1.isValid()) {
                // timer1 could not be set
            }

            std::chrono::system_clock::time_point t = std::chrono::system_clock::now() + std::chrono::milliseconds(50);
            RTTimerNode* t2 = timer2.informAt(t); // one-shot timer to timeout in 50 ms from now
            if (!t2) {
                // timer2 could not be set
            }

            RTTimerId tid3 = timer3.informEvery(800ms); // periodic timer to timeout every 800 ms
            if (!tid3.isValid()) {
                // timer3 could not be set
            }
        `;
    }
}
```

If you set a timer with an absolute time that has already passed, or a relative time of 0, the timeout will happen almost immediately. Note the word "almost", because in practise it always takes a little time for the timeout event to be placed in the controller's event queue, and from there be dispatched to the capsule. 

## Timer Priority
If you want a timeout event to be processed as quickly as possible you can use a higher than default priority when setting the timer. The last parameter of `informIn()`, `informAt()` and `informEvery()` specifies the priority of the timeout event (by default it's `General` which is the normal priority of an event). In the same way you can lower the priority, if you want the timeout event to be handled at a lower priority.

The timer set in the example below will timeout immediately and the timeout event will be processed with a higher than normal priority.

```cpp
timer.informIn(0s, High); 
```

## Cancel a Timer
To cancel a timer you need the [`RTTimerId`](../targetrts-api/class_r_t_timer_id.html) object that you constructed when the timer was set. Call `cancelTimer()` on the timer port, with the [`RTTimerId`](../targetrts-api/class_r_t_timer_id.html) as argument, to cancel the timer. Here is an example where a timer is set, and then immediately cancelled.

```cpp
RTTimerId tid = timer.informIn(RTTimespec(10, 0)); // 10 s
if (!tid.isValid()) {
    // error when setting timer
}
else {
    timer.cancelTimer(tid); 
    // now tid.isValid() will return false
}
```

If you need to cancel a timer from a different code snippet from where it was set, you need to store the [`RTTimerId`](../targetrts-api/class_r_t_timer_id.html) object in a member variable of the capsule.

!!! important
    When you create an [`RTTimerId`](../targetrts-api/class_r_t_timer_id.html) object from an [`RTTimerNode*`](../targetrts-api/class_r_t_timer_node.html), the `RTTimerNode` will store a pointer to internal data of the `RTTimerId` object. The TargetRTS keeps track of `RTTimerNode`s for active timer requests, and may access that internal data of your `RTTimerId` object. It's therefore important to make sure that the address of an `RTTimerId` object doesn't change, as that would make the `RTTimerNode` reference invalid memory. For example, you should not insert `RTTimerId` objects into an `std::vector` as that could change their addresses, and hence invalidate such pointers, when the vector is modified. Either use a collection that doesn't do this (e.g. `std::list`) or store pointers to `RTTimerId` objects in the collection instead of the objects themselves.

Cancelling a timer guarantees that its timeout event will not be received by the capsule. This is true even if, at the time of cancellation, the timeout period has already lapsed, and the timeout event is waiting in the controller's event queue to be dispatched to the capsule. In this case cancelling the timer will remove the timeout event from the queue so that it doesn't get dispatched to the capsule.

However, when the timeout event already has been dispatched, it's too late to cancel the timer. If you still do it you will receive an error. In the same way, it's an error to cancel the same timer more than once. You can call `RTTimerId.isValid()` to check if the `RTTimerId` is still valid (meaning that its timeout event has not been dispatched) before cancelling the timer.

## Timer Data
Just like other events, the timeout event that is sent when a timer has timed out, can have data. At most one data object can be passed, and if you need more you can use a struct or class as data type.

Contrary to data of user-defined events, timer data is untyped (`void*`). You therefore need to provide the [type descriptor](../art-lang/cpp-extensions.md#type-descriptor) of the data as an extra argument when setting the timer. The TargetRTS will copy the provided data into the timeout event, so the type descriptor must provide a copy function.

Here are examples of setting timers with timer data:

```cpp
// Pass a boolean as timer data
bool b = true;
timer1.informIn(RTTimespec(5, 0), &b, &RTType_bool);

// Pass the current time as timer data
RTTimespec now;
RTTimespec::getclock(now);
timer2.informIn(1s, &now, &RTTimespec::classData);
```

!!! note
    Since timer data is untyped, any timeout event can carry any kind of data. While this is flexible, it requires caution since in the timeout transition you need to explicitly cast `rtdata` from `void*` to a pointer to the timer data. You must therefore be sure what type of data each timeout event carries. It's recommended to not use different types of data for the same timer.
    
Here is an example of how to access the data of timer2 from the above example:

```art
timeout: on timer2.timeout
`
    const RTTimespec then = *(static_cast<const RTTimespec*>(rtdata));
`;
```

The data pointed at by `rtdata` for a timeout event is owned by the TargetRTS. It is allocated to a copy of the data that is provided when setting the timer, and deallocated if the timer is cancelled. For a one-shot timer it's also deallocated after the timeout event has been dispatched and handled by the capsule, while for a periodic timer the same data object will be used for each timeout event that is produced.

## Adjust the System Time
Sometimes you may need to adjust the clock of your realtime application. For example, distributed applications that run on different machines in a network may use the Network Time Protocol (NTP) to synchronize the system time over the network. While any timer port can be used for adjusting the system time, it's recommended to only do it through one specific timer port on one specific capsule within the application.

Adjusting the clock is a three-step process:

1. Call `adjustTimeBegin()` on the timer port. This suspends the timing service so no timeouts can happen, and no new timers can be set.
2. Change the system clock by calling a function provided by the operating system.
3. Call `adjustTimeEnd()` on the timer port, and provide the time adjustment as argument. The TargetRTS will recompute new timeout time points for all active timers that have been set with a relative time, for example periodic timers. After that the timing service is resumed.

Note that `adjustTimeEnd()` takes a relative time as argument (positive to move the clock forwards, and negative to move it backwards). However, operating system functions for setting the system clock usually take an absolute time. Here is an example of a capsule member function for setting the system clock to a new absolute time. Replace `sys_setclock()` with the actual function for setting the system clock in your operating system.

```cpp
void AdjustTimeCapsule_Actor::setClock(const RTTimespec& new_time)
{
    RTTimespec old_time, delta;
    
    timer.adjustTimeBegin();
 
    RTTimespec::getclock(old_time); // Read system clock
    if (sys_setclock(new_time)) { // Set system clock with OS function
        delta = new_time;
        delta -= old_time;
    }
 
    timer.adjustTimeEnd(delta);
}
```

Error handling is important in this function; if the function for setting the system clock fails (for example because the application doesn't have enough privileges to change the clock), it must call `adjustTimeEnd()` with a zero time argument, to restart the timing service without changing the clock. `adjustTimeEnd()` works by simply adding a time offset to account for the changed system time, and if the system time was not modified that offset must be zero.

!!! example
    You can find a sample application that changes the system clock [here]({$vars.github.repo$}/tree/main/art-comp-test/tests/timer_adjust_time). The sample is for Windows but can easily be modified for other operating systems.