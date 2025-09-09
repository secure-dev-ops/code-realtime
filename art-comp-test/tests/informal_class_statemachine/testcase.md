---
group: cpp_code_generation
---
A class with a state machine can have the "generate_statemachine" property set to false to prevent code to be generated for the state machine. This can for example be used for creating a class with an informal state machine which is not formally correct, but still can serve as useful documentation about how the class works. Certain validation rules that check the correctness of a class state machine are not run for such state machines.