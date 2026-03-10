---
group: validation
steps: generate
ac_output match1: ERROR[0002]|art_0002_different_kinds_of_elements.art:1:9|parts or ports|p
ac_output match1a: port|p|2:19
ac_output match1b: part|p|4:10

ac_output match2: ERROR[0002]|11:9|parts or ports|p|p2
ac_output match2a: inherited port|p|2:19
ac_output match2b: inherited port|p2|3:19
ac_output match2c: inherited part|p|4:10
ac_output match2d: part|p2|12:10
---
Test scenarios where the validation rule `ART_0002_duplicateNamesInScope` can detect name clashes for elements of different kinds.
- ports and parts
