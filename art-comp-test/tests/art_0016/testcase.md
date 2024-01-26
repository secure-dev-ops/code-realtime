---
group: validation
steps: generate
ac_output match1: ERROR[0016]|1:10|PR1
ac_output match1a: PR1|1:10
ac_output match1b: PR2|5:10
ac_output match2: ERROR[0016]|5:10|PR2
ac_output match2a: PR1|1:10
ac_output match2b: PR2|5:10
ac_output match3: ERROR[0016]|23:7|C3
ac_output match3a: C3|23:7
ac_output match3b: C4|30:7
ac_output match4: ERROR[0016]|30:7|C4
ac_output match4a: C3|23:7
ac_output match4b: C4|30:7
ac_output match5: ERROR[0016]|37:9|Cap1
ac_output match6: ERROR[0016]|48:9|Cap2
ac_output match6a: Cap2|48:9
ac_output match6b: Cap3|57:9
ac_output match7: ERROR[0016]|57:9|Cap3
ac_output match7a: Cap2|48:9
ac_output match7b: Cap3|57:9
---
Test validation rule `ART_0016_circularInheritance`.