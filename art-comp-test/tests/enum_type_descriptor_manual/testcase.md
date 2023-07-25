---
group: cpp_code_generation
---
An enum with the [[rt::manual_descriptor]] attribute set means that it has a type descriptor but one that is manually written rather than automatically generated for it. One reason for using a manual type descriptor is that we don't need all type descriptor functions (due to the way the type is used). In this test we only have an encode function since we don't use the enum for anything else.