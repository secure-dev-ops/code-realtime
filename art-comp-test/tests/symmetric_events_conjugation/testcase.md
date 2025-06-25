---
group: cpp_code_generation
---
Usually two ports at the same level in a composite structure must have opposite conjugations. This is checked by the validation rule ART_0026_connectedPortsWithIncompatibleConjugations. However, if the protocol that types two ports only contain symmetric events, then the conjugation doesn't matter and can be the same since for every out-event sent on the port, there is a corresponding in-event which can be received by the connected port.