---
group: validation
steps: generate
ac_output match1: ERROR|File does not exist|nonexisting.tcjs
---
Test validation rule `TC_7003_prerequisitePathError`. Note that the error message that is reported when using build variants is slightly different and doesn't include the validation rule number (7003) or the location in the TC where the erroneous prerequisite path was found. This is because the evaluation of the TC that is done when initializing build variants happens before the TC validation, so a broken prerequisite will be reported already then. The Art Compiler automated tests use build variants which is why we need to match against that error message.