---
group: cpp_code_generation
---
A class with a state machine is, except for its state machine, a regular C++ class and hence a type descriptor can be generated for it (by setting the property `generate_descriptor` to `true`). A default type descriptor function can be replaced by a custom one. In this test app a custom encode function is provided for encoding the current state of the class. Note that we don't need to customize the copy function (which gets called when the class instance is sent with an event) since the default copy constructor will copy each member, including the state member variable.

