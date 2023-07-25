---
group: cpp_code_generation
stdout_comparison: contains
---
An event (with an enum data) is sent from one capsule to itself by means of a so called "local binding" port. This is a port that is bound to another port on the same capsule. We test that this enum can be sent just like between ports on different capsules. When received, we use the encode function of the type descriptor to get a string representation of the enum.