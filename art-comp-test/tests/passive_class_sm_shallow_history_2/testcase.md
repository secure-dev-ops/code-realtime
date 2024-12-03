---
group: cpp_code_generation
---
This test case verifies the shallow history behavior of the state machine (SM) in MyClass.

Expected Behavior:
The state machine starts with t1 transitioning to Inner1. The first call to op() triggers t2, as the current active state is Inner1. From the second call onwards, op() utilizes the history mechanism, resuming the previously active state, which is Inner2. This ensures proper tracking of state transitions and confirms the functionality of the shallow history mechanism.
