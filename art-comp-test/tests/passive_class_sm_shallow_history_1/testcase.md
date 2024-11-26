---
group: cpp_code_generation
---
This test case verifies the shallow history behavior of the state machine (SM) in MyClass.

Expected Behavior:
Upon transitioning to state TopInner, its entry action is executed.
The initial substate Inner is entered, and its entry action is performed.
When re-entering TopInner through the shallow history entrypoint (opS2Entry), the SM resumes from the last active substate.
State counters reflect accurate entry actions upon each transition and re-entry.
