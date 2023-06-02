---
group: cpp_code_generation
---
Test that generation of a compound transition that contains inherited transitions works correctly w.r.t rtdata. A transition inside a composite state is triggered by an event with a data parameter. It connects to an exit point from where a non-triggered transition originates. In a sub-capsule state machine the triggered transition is redefined to use a trigger with a different data type. In the same way the non-triggered transition is redefined with effect code that expects rtdata to be of that data type.