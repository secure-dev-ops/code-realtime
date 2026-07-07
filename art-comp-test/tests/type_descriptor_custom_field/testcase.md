---
group: type_descriptors
---
This test case demonstrates an approach for overriding type descriptor for a field datatype when standard one `RTType_datatype` does not exist. Check `CustomDescriptors.h` and `CustomDescriptors.cpp`.<br/>

Also test inheritance from TargetRTS datatypes, for example, `RTDataObject`. In this case type descriptor is defined in `TargetRTS`, there is no `RTType_RTDataObject.h` file and `#include <RTType_RTDataObject.h>` should not be generated.
