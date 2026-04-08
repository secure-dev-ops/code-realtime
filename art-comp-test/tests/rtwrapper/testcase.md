---
group: rt_services_library
---

This test validates RTWrapper constructor and sharing semantics implemented in TargetRTS.

1. Verifies the constructor contracts at compile time.
2. Verifies copy constructor behavior by checking that copied wrappers share handle-backed data and type.
3. Verifies assignment operator behavior, including self-assignment and assignment from a temporary copy.
