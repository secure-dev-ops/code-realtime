---
group: cpp_code_generation
stdout_comparison: contains
---
This test app works the same as `struct_type_descriptor` except that here the struct type is defined in a header file (instead of inside an [[rt::decl]] code snippet in an Art file). The Art Compiler analyzes header files in the workspace folder and if it finds a type with the [[rt::auto_descriptor]] it will generate a type descriptor for it (in a .h and .cpp file prefixed with `RTType_`).