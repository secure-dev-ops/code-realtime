---
group: no_validation
---
Test scenarios where the validation rule `ART_0036_unexpectedTriggers` should *not* be triggered. When an entry or exit point has incoming transitions which are defined in a different capsule state machine than the outgoing transition, then triggers of the outgoing transition is not considered unexpected (because they may be necessary in the context of the base capsule where they are defined, and it would be tedious to have to redefine such transitions just for removing the triggers).
