---
group: validation
ac_output match1: WARNING[0041]|94:24|inherited entry point
ac_output match1b: ep2|48:24
ac_output match2: WARNING[0041]|49:23|inherited exit point
ac_output match2b: ex2|52:23
---
Test validation rule `ART_0041_implicitUseOfDeepHistory` for an inherited state machine. Transitions from a base capsule are excluded in the derived top capsule, making it equivalent to the `art_0041` test case.
