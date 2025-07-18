---
group: type_descriptors
---
For classes with fields a field descriptor is generated as a part of type descriptor. Field descriptor will reference type descriptors for the field types.<br>
Test that corresponding includes will be added to the generated file.<br>
This is required for classes defined directly in C++ header files for which a type descriptor is generated to `RTType_filename.*`
