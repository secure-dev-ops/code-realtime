---
group: cpp_code_generation
steps: generate
---
A variant of `choice_transition_implicit_exclude` where the excluded transition targets an entry point of a composite state. Also in this case that transition is implicitly excluded, and the validation rule ART_0007 should not report an error.

Note that due to a bug in the code generator, this test case cannot yet be run, so it currently only tests that ART_0007 is not reported.
