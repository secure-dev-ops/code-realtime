---
group: cpp_code_generation
---
When locating the triggers that may trigger a compound transition a junction may be encountered with multiple incoming transitions. If these are triggered transitions that trigger on different events, but with the same data type, the functions generated for the transitions in the compound transition should have rtdata typed by that data type. But if the events have different types, then rtdata will be an untyped pointer.