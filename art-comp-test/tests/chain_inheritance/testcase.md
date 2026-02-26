---
group: cpp_code_generation
timeout: 2
---
Test that generated capsule does not go into an infinite loop while executing inherited chain function for `disable_ss` transition.
Chain function calls `exitToChainState` function with `rtg_parent_state` array which is different in base capsule and derived capsule.
