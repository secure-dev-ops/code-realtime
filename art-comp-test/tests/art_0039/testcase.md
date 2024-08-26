---
group: validation
steps: generate
ac_output match1: WARNING[0039]|7:10|p1|ping
ac_output match1a: connector|missing|Top|6:9
ac_output match2: WARNING[0039]|8:5|p2|pong
ac_output match2a: connector|missing|Top|6:9
ac_output match3: WARNING[0039]|10:19|1 connection|topP1|allows 2 connections
ac_output match3a: possible solution|connect more|topP1|Top|6:9
ac_output match3b: possible solution: decrease the multiplicity of the port|topP1|10:19
ac_output match3c: connector|Top|13:24
ac_output match4: WARNING[0039]|11:19|2 connections|topP2|only 1 connection
ac_output match4a: connector|Top|2 connections|13:13
ac_output match5: WARNING[0039]|42:10|only 7 connections|p|inner2|allow 8 connections
ac_output match5a: possible solution|decrease the multiplicity of the port|p|31:27
ac_output match5b: possible solution|connect more|p|Pinger|39:9
ac_output match5c: possible solution|decrease the multiplicity of the part|inner2|42:10
ac_output match5d: connector|Pinger|3 connections|46:13
ac_output match5e: connector|Pinger|4 connections|48:13
ac_output match6: WARNING[0039]|45:19|4 connections|px|only 3 connections
ac_output match6a: connector|Pinger|4 connections|46:21
ac_output match7: WARNING[0039]|47:19|5 connections|px2|only 4 connections
ac_output match7a: connector|Pinger|5 connections|48:22
---
Test validation rule `ART_0039_portPartMultiplicityMismatch`.
