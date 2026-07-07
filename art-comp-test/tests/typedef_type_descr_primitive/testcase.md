---
group: type_descriptors
---
This test case is using a set of data types for which type descriptors are generated automatically. Class `TraceEvent` defines public fields (`TraceHandle handle;`). Generated field descriptor references type descriptors for field datatypes and code generator should automatically add proper includes, for example, `#include <RTType_TraceHandle.h>`.
