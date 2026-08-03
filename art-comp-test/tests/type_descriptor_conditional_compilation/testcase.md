---
group: type_descriptors
---
This test is similar to `struct_type_descriptor`, but here the type is within a conditional compilation section that only gets compiled if a macro TEST_MACRO is defined. It tests that preprocessor macros set in the TC are considered when parsing C++ code snippets for finding [[rt::auto_descriptor]] marked types to generate a descriptor for.
