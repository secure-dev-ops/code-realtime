---
group: type_descriptors
---
A struct with the [[rt::auto_descriptor]] attribute set will get a generated type descriptor and for each member variable of the struct a field descriptor is generated. For a pointer member variable the field descriptor will contain a type modifier which specifies the pointer "indirection".