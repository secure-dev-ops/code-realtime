---
group: cpp_code_generation
---
Test that chain calls are generated for all transitions when there are several guarded transitions from state to junction.

State `A` has 2 transitions `a` and `b` with the same trigger but different guard conditions targeting the same junction `j1`. There is a following transition from junction `j1` to state `B`.
For both transitions `a` and `b` a guard and 2 chain calls must be generated.
