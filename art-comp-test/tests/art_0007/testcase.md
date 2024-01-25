---
group: validation
steps: generate
ac_output match1: ERROR[0007]|6:16
ac_output match1a: 'else' transition|8:9
ac_output match1b: 'else' transition|9:9

ac_output match2: ERROR[0007]|art_0007_inherited.art:23:24|inherited choice|more than one outgoing 'else'
ac_output match2a: Inherited choice|cc2|12:20
ac_output match2b: 'else' transition|24:13
ac_output match2c: 'else' transition|13:13

ac_output match3: ERROR[0007]|art_0007_inherited.art:20:5|inherited choice|more than one outgoing 'else'
ac_output match3a: Inherited choice|cc|8:16
ac_output match3b: 'else' transition|22:9
ac_output match3c: 'else' transition|9:9
---
Test validation rule `ART_0007_choiceWithTooManyElseTransitions`.
