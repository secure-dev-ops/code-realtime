---
group: cpp_code_generation
---
When transitions are redefined so rtdata for a transition effect or guard function has a different type in a sub-capsule compared to in a super-capsule, then it's necessary to keep redefining all transitions that follow it in the compound transition to ensure they will get a transition function in the sub-capsule class with a correctly typed rtdata. The alternative would be to duplicate the inherited effect or guard code snippets in the sub-capsule class (like how it's done in Model RealTime), but we want to avoid such code duplication.