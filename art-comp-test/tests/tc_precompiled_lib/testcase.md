---
group: tc
compiler: GNU
steps: generate-build, execute
ac_cmd_args: --clean
ac_output clean1: Cleaning generated target projects ...
ac_output clean2: Cleaning generated target projects completed
---
Top TC has precompiled library TC as prerequisite. It should link with precompiled library from specified location.
--clean command should not clean precompiled library TC.
