---
group: validation
steps: generate
ac_output match1: ERROR[0036]|10:13|transition|entry point with incoming
ac_output match1a: Incoming transition|16:9
ac_output match2: ERROR[0036]|17:9|t1|junction
ac_output match3: ERROR[0036]|19:9|t3|choice
ac_output match4: ERROR[0036]|20:9|t4|exit point with incoming
ac_output match4a: Incoming transition|11:13
ac_output match5: ERROR[0036]|art_0036_inheritance.art|27:5|inherited transition|exit point with incoming
ac_output match5a: Incoming transition|10:13
ac_output match5b: Inherited transition|17:9
ac_output match6: ERROR[0036]|art_0036_inheritance.art|67:5|inherited transition|entry point with incoming
ac_output match6a: Inherited transition|59:13
ac_output match6b: Incoming transition|62:9
ac_output match7: ERROR[0036]|art_0036_passive_class_sm.art|8:9|junction
---
Test validation rule `ART_0036_unexpectedTriggers`.
