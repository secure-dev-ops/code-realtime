---
group: validation
steps: generate
ac_output match1: ERROR[0025]|7:10|unwired_port1|ping
ac_output match1a: connection|12:13
ac_output match2: ERROR[0025]|8:5|unwired_port2|pong
ac_output match2a: connection|12:37
ac_output match3: ERROR[0025]|10:10|p1|a
ac_output match3a: unexpected connector|Another|55:13
ac_output match4: ERROR[0025]|14:35|unwired_port1
ac_output match4a: connection|16:13
ac_output match5: ERROR[0025]|15:37|unwired_port2
ac_output match5a: connection|16:32
ac_output match6: ERROR[0025]|18:27|unwired_port3
ac_output match6a: connection|24:26
---
Test validation rule `ART_0025_portConnectionError`.
