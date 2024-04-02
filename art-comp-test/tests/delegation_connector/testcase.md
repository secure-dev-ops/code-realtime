---
group: cpp_code_generation
---
A delegation connector connects two ports with the same conjugation. It allows a capsule to delegate some of the events it receive by forwarding them via a relay port to a port on a part capsule. The forwarding is only conceptual - at runtime a relay port does not exist and the source and target port are directly connected. That is, in this sample Top::p is directly connected to B::p and the relay port A::p does not exist at runtime.