---
group: cpp_code_generation
---
Issue reproduction for composite-state redefinition: in `Wait_For_Messages`, the redefined transition (`initialized_ss`: `entryPoint_0 -> Disabled_SS.entryPoint_0`) and redefined `Enable` transition (`Disabled_SS.exitPoint_0 -> c_is_initialized`) are not shown in diagram editor.
This test model reproduces the problem using inheritance chain `LT_S_S -> LT_S_N -> LT_S_TLN`, where `Wait_For_Messages` is redefined and transition routing is expected through choice `c_is_initialized`.
