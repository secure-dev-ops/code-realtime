---
group: cpp_code_generation
---
A delegation connector connects two ports with the same conjugation (non conjugation). It allows a capsule to delegate some of the events it receive by forwarding them via a relay port to a port on a part capsule. The forwarding is only conceptual - at runtime a relay port does not exist and the source and target port are directly connected. That is, In this sample Top::p is directly connected to D::p, and the nested relay port A::p, B::p, C::p does not exist at runtime.