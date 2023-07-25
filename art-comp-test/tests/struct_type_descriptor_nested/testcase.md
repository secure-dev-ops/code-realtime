---
group: cpp_code_generation
---
A struct can have a member variable typed by another struct. In that case the type descriptor of the enclosing struct will depend on the type descriptor of the type of that member variable. Here we test to send an event with such a struct from one capsule to itself, and make sure it can be correctly JSON encoded.