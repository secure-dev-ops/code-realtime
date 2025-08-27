---
group: cpp_code_generation
---
When a local transition is triggered the composite state that contains it will not be exited and entered, but nested states will. Entering happens top-down and exiting happens bottom-up in the state hierarchy.
This sample uses a local transition, which connects an entry point of a composite state with a substate inside that composite state. It behaves the same as a local self-transition except that the target substate is entered instead of the composite state.