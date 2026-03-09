---
group: validation
steps: generate
ac_output match1: ERROR[0006]|6:16

ac_output match21: ERROR[0006]|art_0006_class.art|6:16
ac_output match23: ERROR[0006]|8:20

ac_output match3: ERROR[0006]|art_0006_inheritance.art|12:16|A choice must have at least one outgoing
ac_output match4: ERROR[0006]|17:5|inherited choice without any outgoing
ac_output match4a: Inherited choice|c|8:16
ac_output match5: ERROR[0006]|17:5|inherited choice without any outgoing
ac_output match5a: Inherited choice|unused|12:16
---
Test validation rule `ART_0006_choiceWithoutOutgoingTransitions`.
