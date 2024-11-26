---
group: cpp_code_generation
---
This test case verifies the behavior of the shallow history pseudo state in a class state machine.

Expected Behavior:<br>
Upon entering state S2, its entry action should execute exactly once.<br>
The Inner State transitions to the shallow history state when triggered by op.<br>
As a result, the active state should return to the previous state within the Inner State.
