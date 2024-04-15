---
group: tc
steps: generate
ac_output match1: ERROR|top.tcjs|2:21|Missing close quote
ac_output match2: ERROR|Failed to evaluate TC
---
Test error reporting in case the TC has a syntax error. The file name, position, and JavaScript parser error message is reported.
