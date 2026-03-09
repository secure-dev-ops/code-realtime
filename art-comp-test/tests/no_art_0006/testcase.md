---
group: no_validation
---
Test scenarios where the validation rule `ART_0006_choiceWithoutOutgoingTransitions` should *not* be triggered.
A choice cannot be excluded, but by excluding all its incoming and outgoing transitions the same effect as exclusion can be accomplished (i.e. such a choice does nothing in a derived state machine). ART_0006 should therefore not be reported in this case (and also not ART_0005).
