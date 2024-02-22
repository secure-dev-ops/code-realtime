---
group: validation
steps: generate
ac_output match1: ERROR[0030]|art_0030.art|7:9|BS
ac_output match2: ERROR[0030]|art_0030_inheritance.art|13:9|State
ac_output match3: ERROR[0030]|27:5|inherited transition|State2
ac_output match3a: Inherited triggered transition '_tx'|13:9
---
Test validation rule `ART_0030_transitionToCompositeStateNoEntryNoInitialTrans`.
