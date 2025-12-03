---
group: cpp_code_generation
---
When a type descriptor is generated for a class it's necessary to know if the class is abstract or not. A class is abstract if it has at least one pure virtual function, or inherits (without overriding) such a function. Non-abstract types can be used for message data, but for abstract types this is not possible since such types cannot be instantiated. This test makes sure that the analysis of pure virtual functions correctly classifies types as abstract or non-abstract, and that non-abstract types can be used for event data.