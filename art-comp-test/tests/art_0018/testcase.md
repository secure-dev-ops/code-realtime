---
group: validation
steps: generate
ac_output match1: ERROR[0018]|3:5
ac_output match1a: t2|9:9
ac_output match1b: t3|10:9
ac_output match2: ERROR[0018]|17:5
ac_output match2a: Transition|23:13
ac_output match2b: Transition|24:13
ac_output match2c: Transition|27:9

ac_output match3: ERROR[0018]|art_0018_inherited_sm.art|21:5
ac_output match3a: Transition|11:9
ac_output match3b: Transition|22:9
---
Test validation rule `ART_0018_circularTransitions`. Transition cycles can occur when junction or entry/exit points are incorrectly used.
