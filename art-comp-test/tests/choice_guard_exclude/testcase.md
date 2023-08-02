---
group: cpp_code_generation
---
A base capsule has a state machine where a choice is used for deciding which state to enter first, A or B. The guard condition for one of the two non-triggered transitions that leave the choice will evaluate so that A will be entered. In a derived capsule that transition is excluded which means that only the other transition remains. Hence, B is entered as the first state for the derived capsule.