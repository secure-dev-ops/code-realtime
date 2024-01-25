---
group: validation
steps: generate
ac_output match1: ERROR[0006]|6:16
ac_output match2: WARNING[0005]|6:16

ac_output match21: ERROR[0006]|art_0006_class.art|6:16
ac_output match22: WARNING[0005]|6:16
ac_output match23: ERROR[0006]|8:20
ac_output match24: WARNING[0005]|8:20

ac_output match3: ERROR[0006]|13:5|inherited choice without any outgoing
ac_output match3a: Inherited choice|c|7:16
ac_output match4: WARNING[0005]|13:5|inherited choice without an outgoing 'else'
ac_output match4a: Inherited choice|c|7:16
---
Test validation rule `ART_0006_choiceWithoutOutgoingTransitions`.
