---
group: cpp_code_generation
---
This example shows the main difference between a choice and a junction. For a junction, guards of outgoing transitions are evaluated already when leaving the source state (and the state is only left if at least one of them is fulfilled). For a choice, however, this evaluation happens not until the state machine is in the choice. That's why it's very important to have a transition with an else-guard for a choice to avoid getting stuck in the state.