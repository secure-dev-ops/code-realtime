---
group: cpp_code_generation
---
A class with a state machine is, except for its state machine, a regular C++ class and hence a type descriptor can be generated for it. However, just like for a regular class, a type descriptor is by default not generated. You need to set the property `generate_descriptor` to `true` if you want the class to have a type descriptor.
Note that just like for a regular class, a class with state machine needs a field descriptor declaration if it has non-public members.

