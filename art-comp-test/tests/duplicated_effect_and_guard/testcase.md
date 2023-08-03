---
group: cpp_code_generation
---
When transitions are redefined so rtdata for a transition effect or guard function has a different type in a sub-capsule compared to in a super-capsule, then these functions must be duplicated in the sub-capsule since the super-capsule functions cannot be called from the sub-capsule functions. In this case a warning should be printed to inform the user about the code duplication (so he can make sure these duplicated code snippets are not too big).