---
group: cpp_code_generation
---
For class state machines, this test case ensures that the correct trigger operation is called according to precedence rules.

In this example, States A, B, and C are nested states, each containing the trigger operation op1. State C is within the scope of B, and B is within the scope of A. When the trigger op1 is called, it is expected to invoke the op1 operation inside State C due to the nesting hierarchy, where the innermost state (C) takes precedence.