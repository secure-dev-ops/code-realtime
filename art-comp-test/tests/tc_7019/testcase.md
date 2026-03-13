---
group: validation
steps: generate
ac_output match1: WARNING|Ignored loading|lib.art|from|lib.tcjs|it was already loaded from|lib02.tcjs

ac_output match2: ERROR[7019]|top.tcjs|5:1|same name 'Top'
ac_output match2a: lib.art|6:9|capsule with duplicated name 'Top'
ac_output match2b: top.art|1:9|capsule with duplicated name 'Top'
ac_output match2c: top.art|12:9|capsule with duplicated name 'Top'
---
Test validation rule `TC_7019_duplicateNamesInGlobalScope`.
