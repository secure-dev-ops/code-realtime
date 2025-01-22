---
group: cpp_code_generation
---
This test case verifies that the passive state machine triggerOp handles transitions correctly when they occur between two entry points. It ensures the following:

State entry actions are called in the correct order.
Effect code executes properly when the transition occurs between multiple entry points.
Exit actions are called in the correct order.

In the above example, _State_State1 is split into two transitions based on conditions. This test case verifies that the effect code for the transition _State_State1 is executed in both cases.

