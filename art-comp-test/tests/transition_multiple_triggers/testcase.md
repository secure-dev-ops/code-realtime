---
group: cpp_code_generation
steps: clean, generate-build
---
Transition has 2 triggers with the same event but from different ports. Ports are typed by the same protocol and have the same conjugation.
Generated transition must have concrete type `PROTO::Base *` for the second argument `rtport`.
Transition code is expecting correct type for `rtport` and is calling another event function from it `rtport->oe2().reply()`.
Test case must compile fine. Execution is not needed.
