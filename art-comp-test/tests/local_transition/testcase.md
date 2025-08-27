---
group: cpp_code_generation
---
When a local transition is triggered the composite state that contains it will not be exited and entered, but nested states will. Entering happens top-down and exiting happens bottom-up in the state hierarchy.
This sample uses a local self-transition, which connects an entry point and an exit point on the same composite state.