---
group: rt_services_library
---
A capsule instance can communicate synchronously with another capsule instance that runs in the same controller. This is done by calling `invoke()` instead of `send()` on the protocol event. The invoked capsule instance can call `reply()` to pass a result back to the caller.
It's also possible for the caller and callee to agree to make an implicit reply (if no data needs to be passed back to the caller).
In case the caller makes the invoke on a port with non-single multiplicity, and doesn't use `invokeAt()` for only communicating with one of the connected callees, then the invoke is broadcasted and all connected capsules instances can make a reply.