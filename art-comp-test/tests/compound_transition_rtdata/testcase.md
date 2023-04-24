---
group: cpp_code_generation
---
Test that generation of a compound transition works correctly w.r.t rtdata. A transition inside a composite state is triggered by an event with a data parameter. It connects to an exit point from where a non-triggered transition originates. Effect code in that transition accesses rtdata which then should be typed by the type of the data parameter.