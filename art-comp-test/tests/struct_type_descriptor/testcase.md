---
group: cpp_code_generation
---
A struct with the [[rt::auto_descriptor]] attribute set means that a type descriptor should be automatically generated for it. The type descriptor contains (among other things) an encode function that can convert an instance of the struct to a string representation. Here we test to send an event with a struct from one capsule to another. When received, we use the encode function of the type descriptor to get a string representation of the struct.