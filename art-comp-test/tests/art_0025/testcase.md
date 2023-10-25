---
group: validation
steps: generate
ac_output match1: ERROR[0025]|12:35|unwired_port1
ac_output match1a: connection|14:13
ac_output match2: ERROR[0025]|13:37|unwired_port2
ac_output match2a: connection|14:32
ac_output match3: ERROR[0025]|16:27|unwired_port3
ac_output match3a: connection|22:26
ac_output match4: ERROR[0025]|7:10|1|p1|ping
ac_output match4a: present|Pinger|42:13
ac_output match4b: missing|Top|6:9
ac_output match5: ERROR[0025]|7:10|unwired_port1|ping
ac_output match5a: connection|10:13
ac_output match6: ERROR[0025]|7:10|1|p2|ping
ac_output match6a: present|Top|22:13
ac_output match6b: missing|Pinger|39:9
ac_output match7: ERROR[0025]|8:5|0|p2|pong
ac_output match7a: missing|Top|6:9
ac_output match8: ERROR[0025]|8:5|unwired_port2|pong
ac_output match8a: connection|10:37
---
Test validation rule `ART_0025_portConnectionError`.

