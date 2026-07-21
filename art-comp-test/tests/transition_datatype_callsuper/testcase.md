---
group: cpp_code_generation
---
Base class has a Transition that has 2 triggers: one is a specific event with an `int` datatype and the other is an `AnyRecieveEvent (*)`.
Derived class redefines this transition and has 3 triggers: one inherited one with int, second is event with `void` data type and then an `AnyRecieveEvent (*)`
Generated transition action must have the first argument `rtdata` degraded to `const void *` (instead of `const int *`).
Derived transition is calling super transition with `CALLSUPER` and prototypes must match.
