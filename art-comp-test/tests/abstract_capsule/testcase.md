---
group: cpp_code_generation
---
Capsules can be declared as abstract by means of the `abstract` keyword. Such a capsule cannot be incarnated, but you can use it as a base for other capsules. Certain validation rules that check the correctness of a capsule state machine are not run for abstract capsules, since those are expected to be specialized in derived capsules.