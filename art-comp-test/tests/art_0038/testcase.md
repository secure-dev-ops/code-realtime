---
group: validation
steps: generate
ac_output match1: WARNING[0038]|9:26|A Timing port should not be declared as 'notify'
ac_output match2: WARNING[0038]|10:26|An Exception port should not be declared as 'notify'
ac_output match3: WARNING[0038]|11:26|An External port should not be declared as 'notify'
ac_output match4: WARNING[0038]|12:26|A Log port should not be declared as 'notify'
ac_output match5: WARNING[0038]|13:26|A Frame port should not be declared as 'notify'

ac_output match1: WARNING[0038]|15:27|A Timing port should not be declared as 'publish'
ac_output match2: WARNING[0038]|16:27|An Exception port should not be declared as 'publish'
ac_output match3: WARNING[0038]|17:27|An External port should not be declared as 'publish'
ac_output match4: WARNING[0038]|18:27|A Log port should not be declared as 'publish'
ac_output match5: WARNING[0038]|19:27|A Frame port should not be declared as 'publish'

ac_output match1: WARNING[0038]|21:29|A Timing port should not be declared as 'subscribe'
ac_output match2: WARNING[0038]|22:29|An Exception port should not be declared as 'subscribe'
ac_output match3: WARNING[0038]|23:29|An External port should not be declared as 'subscribe'
ac_output match4: WARNING[0038]|24:29|A Log port should not be declared as 'subscribe'
ac_output match5: WARNING[0038]|25:29|A Frame port should not be declared as 'subscribe'

ac_output match1: WARNING[0038]|27:19|A Timing port should not be declared as 'conjugated'
ac_output match2: WARNING[0038]|28:19|An Exception port should not be declared as 'conjugated'
ac_output match3: WARNING[0038]|29:19|An External port should not be declared as 'conjugated'
ac_output match4: WARNING[0038]|30:19|A Log port should not be declared as 'conjugated'
ac_output match5: WARNING[0038]|31:19|A Frame port should not be declared as 'conjugated'

ac_output match1: WARNING[0038]|33:42|A Timing port should not be declared as 'conjugated', 'notify', 'publish', 'unwired'
ac_output match2: WARNING[0038]|34:42|An Exception port should not be declared as 'conjugated', 'notify', 'publish', 'unwired'
ac_output match3: WARNING[0038]|35:42|An External port should not be declared as 'conjugated', 'notify', 'publish', 'unwired'
ac_output match4: WARNING[0038]|36:42|A Log port should not be declared as 'conjugated', 'notify', 'publish', 'unwired'
ac_output match5: WARNING[0038]|37:42|A Frame port should not be declared as 'conjugated', 'notify', 'publish', 'unwired'

ac_output match1: WARNING[0038]|39:37|A Timing port should not be declared as 'subscribe', 'unwired'
ac_output match2: WARNING[0038]|40:37|An Exception port should not be declared as 'subscribe', 'unwired'
ac_output match3: WARNING[0038]|41:37|An External port should not be declared as 'subscribe', 'unwired'
ac_output match4: WARNING[0038]|42:37|A Log port should not be declared as 'subscribe', 'unwired'
ac_output match5: WARNING[0038]|43:37|A Frame port should not be declared as 'subscribe', 'unwired'

---
Test validation rule `art_0038_portwithpredefinedprotocolnotcorrectlydeclared`.
Ports typed by a predefined protocol (Timing, Log, External, Exception or Frame) 
cannot be used in the same way as ports that are typed by user-defined protocols.	
For example, it does not make sense to connect such ports with connectors since no events can be sent to them. 
Because of the following keywords are not applicable for such ports: notify, publish, subscribe, unwired
