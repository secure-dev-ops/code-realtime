---
group: cpp_code_generation
---
An enum with the [[rt::auto_descriptor]] attribute set means that a type descriptor will be automatically generated for it. The type descriptor contains (among other things) an encode function that can convert an instance of the enum to a string representation. Here we test to send an event with an enum from one capsule to another. When received, we use the encode function of the type descriptor to get a string representation of the enum.