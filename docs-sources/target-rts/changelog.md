It's common to extend the TargetRTS with your own utilities and customizations. In this case you will build your application against a copy of the TargetRTS that contains these changes. However, when a new version of the TargetRTS is released, you then must incorporate the changes in that new version in your own copy of the TargetRTS. This document helps with this process by listing all changes made in the TargetRTS since version 8000 (which were delivered with {$product.name$} 1.0.0). For changes in older versions of the TargetRTS, which were done for {$rtist.name$}, see [this document](https://model-realtime.hcldoc.com/help/topic/com.ibm.xtools.rsarte.webdoc/pdf/ModelRealTime_RoseRT_All_Changes_in_Cpp_TargetRTS.pdf).

!!! note 
    The version of the TargetRTS is defined in the file `RTVersion.h` by means of the macro `RT_VERSION_NUMBER`.

| TargetRTS Version | Included Changes | 
|----------|:-------------|
| 8001 | [JSON Decoding](#json-decoding) | 

## JSON Decoding
A new decoder class `RTJsonDecoding` is now available for decoding messages and data from JSON. JSON produced from data by the JSON Encoder (`RTJsonEncoding`) can be decoded back to (a copy of) the original data.

