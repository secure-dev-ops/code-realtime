---
group: validation
steps: generate
ac_output match1: ERROR[7012]|top.tcjs|8:1|L1|MyThread
ac_output match2: ERROR[7012]|top.tcjs|8:1|L2|MyThread|MyThread2
ac_output match3: ERROR[7012]|top.tcjs|8:1|LibThread
---
Test validation rule `TC_7012_duplicateLogicalThreadName`.
