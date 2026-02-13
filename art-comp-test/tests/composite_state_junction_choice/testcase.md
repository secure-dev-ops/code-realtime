---
group: cpp_code_generation
---
Test that chain calls are generated for all transitions when there are several guarded transitions from state to junction.

Composite state contains junctions, choice and many transitions with guards.
Run generated application and compare output with golden `stdout.txt`.
