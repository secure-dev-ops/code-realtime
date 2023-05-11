---
group: cpp_code_generation
---
Test that protocol inheritance works correctly w.r.t redefined events. An event defined in a base protocol which is redefined in a derived protocol is sent between two capsules twice using two ports typed by the respective protocols. First we send the redefining event from the derived protocol, and then the redefined event in the derived protocol. The type of rtdata in the triggered transitions should match the type of the event parameter.