---
group: cpp_code_generation
---
An entry point without an incoming transition can be triggered regardless of which substate that is active in the composite state that owns the entry point. When it is triggered the composite state remains active and is not exited and entered. In this test the entry point transition targets a substate of the composite state. It can also trigger the deep history or an exit point (i.e. be a local transition).