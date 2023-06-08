---
group: cpp_code_generation
ac_cmd_args: --buildVariants build_variants.js --buildConfig=custom_value
ac_output: msg0: INFO_:_custom value BV
---
Tests a simple use of build variants. A constant gets its value based on a preprocessor macro, and build variants are defined to allow setting this macro at build time.