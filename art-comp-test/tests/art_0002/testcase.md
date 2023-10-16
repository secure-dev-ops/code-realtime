---
group: validation
steps: generate
ac_output match1: ERROR[0002]|another.art:1:9|workspace|capsule|XCap
ac_output match2: ERROR[0002]|another.art:8:10|workspace|protocol|DP
ac_output match3: ERROR[0002]|art_0002.art:14:9|workspace|capsule|XCap
ac_output match4: ERROR[0002]|art_0002.art:21:10|workspace|protocol|DP
ac_output match5: ERROR[0002]|art_0002.art:1:10|protocol|in-events|inEvent1|inEvent2
ac_output match6: ERROR[0002]|art_0002.art:1:10|protocol|out-events|outEvent1
ac_output match7: ERROR[0002]|art_0002.art:34:7|class|trigger operations|op2
ac_output match8: ERROR[0002]|art_0002.art:43:9|capsule|parts|p
ac_output match9: ERROR[0002]|art_0002.art:52:9|capsule|ports|t
ac_output match10: ERROR[0002]|art_0002.art:62:5|state machine|vertices|State
ac_output match11: ERROR[0002]|art_0002.art:71:15|nested state machine|transitions|t
---
Test validation rule `ART_0002_duplicateNamesInScope`.