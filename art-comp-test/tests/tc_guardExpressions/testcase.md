---
group: tc
---
Test `tc.guardExpressions` property. By default it is set to `true`. It controls if code generator should try to identify guard code snippets as expressions and generate additional return in front of user code.
For models migrated from ModelRT this property should be set to `false` since in ModelRT all guard code snippets are statements (not expressions).
