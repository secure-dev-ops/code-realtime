---
group: validation
steps: generate
ac_output match1: WARNING[4000]|2:9|e1|MyClass*
ac_output match2: WARNING[4000]|3:9|e2|std::string
ac_output match3: WARNING[4000]|4:9|e3|TplClass<int>
---
Test validation rule `CPP_4000_eventTypeWithoutTypeDescriptor`.
