---
group: validation
steps: generate
ac_output match1: ERROR[0002]|art_0002_class_inheritance.art:26:7|trigger operations|op
ac_output match1a: inherited trigger operation|op|2:13
ac_output match1b: inherited trigger operation|op|11:13
ac_output match1c: trigger operation|op|27:13

ac_output match2: ERROR[0002]|art_0002_protocol_inheritance.art:6:10|in-events|e1
ac_output match2a: inherited in-event|e1|2:8
ac_output match2b: in-event|e1|7:8

ac_output match3: ERROR[0002]|art_0002_protocol_inheritance.art:6:10|out-events|e2
ac_output match3a: inherited out-event|e2|3:9
ac_output match3b: out-event|e2|8:9

ac_output match4: ERROR[0002]|art_0002_statemachine_inheritance.art:14:5|vertices|State|j1
ac_output match4a: inherited state|State|4:15
ac_output match4b: inherited junction|j1|6:18
ac_output match4c: state|State|15:15
ac_output match4d: choice|j1|16:16

ac_output match5: ERROR[0002]|art_0002_statemachine_inheritance.art:17:24|vertices|Nested
ac_output match5a: inherited state|Nested|8:19
ac_output match5b: state|Nested|18:19

ac_output match6: ERROR[0002]|art_0002_structure_inheritance.art:19:9|parts|c
ac_output match6a: inherited part|c|12:10
ac_output match6b: part|c|23:19

ac_output match7: ERROR[0002]|art_0002_structure_inheritance.art:19:9|ports|timer|p2
ac_output match7a: inherited port|timer|9:19
ac_output match7b: inherited port|p2|10:19
ac_output match7c: port|timer|20:19
ac_output match7d: port|p2|21:19

ac_output match8: ERROR[0002]|art_0002_structure_inheritance.art:24:5|vertices|State
ac_output match8a: inherited state|State|14:15
ac_output match8b: state|State|25:15
---
Test validation rule `ART_0002_duplicateNamesInScope` with regards to inheritance.

