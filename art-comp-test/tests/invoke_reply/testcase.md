---
group: rt_services_library
---
A capsule instance can communicate synchronously with another capsule instance that runs in the same controller. This is done by calling `invoke()` instead of `send()` on the protocol event. The invoked capsule instance can call `reply()` to pass a result back to the caller.