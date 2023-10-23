---
group: validation
steps: generate
ac_output match1: ERROR[0002]|another.art:1:9|workspace|capsule|XCap
ac_output match1a: capsule|XCap|another.art|1:9
ac_output match1b: capsule|XCap|art_0002.art|14:9
ac_output match2: ERROR[0002]|another.art:8:10|workspace|protocol|DP
ac_output match2a: protocol|DP|another.art|8:10
ac_output match2b: protocol|DP|art_0002.art|21:10
ac_output match3: ERROR[0002]|art_0002.art:14:9|workspace|capsule|XCap
ac_output match3a: capsule|XCap|another.art|1:9
ac_output match3b: capsule|XCap|art_0002.art|14:9
ac_output match4: ERROR[0002]|art_0002.art:21:10|workspace|protocol|DP
ac_output match4a: protocol|DP|another.art|8:10
ac_output match4b: protocol|DP|art_0002.art|21:10
ac_output match5: ERROR[0002]|art_0002.art:1:10|protocol|in-events|inEvent1|inEvent2
ac_output match5a: in-event|inEvent1|art_0002.art|2:8
ac_output match5b: in-event|inEvent1|art_0002.art|3:8
ac_output match5c: in-event|inEvent2|art_0002.art|5:8
ac_output match5d: in-event|inEvent2|art_0002.art|6:8
ac_output match6: ERROR[0002]|art_0002.art:1:10|protocol|out-events|outEvent1
ac_output match6a: out-event|outEvent1|art_0002.art|8:9
ac_output match6b: out-event|outEvent1|art_0002.art|9:9
ac_output match7: ERROR[0002]|art_0002.art:34:7|class|trigger operations|op2
ac_output match7a: trigger operation|op2(long long)|art_0002.art|35:13
ac_output match7b: trigger operation|op2(long long)|art_0002.art|36:13
ac_output match8: ERROR[0002]|art_0002.art:43:9|capsule|parts|p
ac_output match8a: part|p|art_0002.art|44:10
ac_output match8b: part|p|art_0002.art|45:19
ac_output match9: ERROR[0002]|art_0002.art:52:9|capsule|ports|t
ac_output match9a: port|t|art_0002.art|53:19
ac_output match9b: port|t|art_0002.art|54:19
ac_output match10: ERROR[0002]|art_0002.art:62:5|state machine|vertices|State
ac_output match10a: state|State|art_0002.art|63:15
ac_output match10b: state|State|art_0002.art|63:22
ac_output match11: ERROR[0002]|art_0002.art:71:15|nested state machine|transitions|t
ac_output match11a: transition|t|art_0002.art|73:13
ac_output match11b: transition|t|art_0002.art|74:13
---
Test validation rule `ART_0002_duplicateNamesInScope`.