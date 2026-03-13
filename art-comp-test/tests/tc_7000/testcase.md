---
group: validation
steps: generate
ac_output match1: ERROR[7000]|top.tcjs|5:1|copyrightText|string
ac_output match2: ERROR[7000]|top.tcjs|6:1|cppCodeStandard|C++ 20|C++ 17|C++ 14|C++ 11|C++ 98|Older than C++ 98
ac_output match3: ERROR[7000]|top.tcjs|7:1|sources|list of strings
ac_output match4: ERROR[7000]|top.tcjs|8:1|userLibraries|list of strings
---
Test validation rule `TC_7000_wrongValueType`.
