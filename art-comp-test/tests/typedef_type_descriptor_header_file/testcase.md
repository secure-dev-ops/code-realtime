---
group: cpp_code_generation
---
This test app works the same as `typedef_type_descriptor` except that here the typedef type and custom encode function prototypes are defined in a header file (instead of inside an [[rt::decl]] code snippet in an Art file). The Art Compiler analyzes header files in the workspace folder and if it finds a type with the [[rt::auto_descriptor]] it will generate a type descriptor for it (in a .h and .cpp file prefixed with `RTType_`). Art Compiler also checks for descriptor function prototypes in the header file and it will not generate default implementations if there are custom functions declared.
