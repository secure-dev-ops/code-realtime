!!! note 
    Some of the information in this chapter is only applicable for the Commercial Edition of {$product.name$} since it includes the source code for the TargetRTS. With the Community Edition comes only precompiled versions of the TargetRTS for a limited number of commonly used target configurations.

It's common to extend and modify the TargetRTS with your own utilities and customizations. In this case you will build your application against a copy of the TargetRTS that contains these changes. However, when a new version of the TargetRTS is released, you then must incorporate the changes in that new version into your own copy of the TargetRTS. This document helps with this process by documenting all changes made in the TargetRTS. It also describes some strategies for more easily managing multiple versions of the TargetRTS.

!!! note 
    The version of the TargetRTS is defined in the file `RTVersion.h` by means of the macro `RT_VERSION_NUMBER`.

## Patch Files
To simplify the process of adopting changes from a new version of the TargetRTS, so called patch files are provided in the folder `TargetRTS_changelog` (located next to the `TargetRTS` folder). The patch files have names `<from-version>_<to-version>.patch` and contain all changes made from one version to another. You can use the command-line tool `patch` to automatically apply the changes of a patch file to your own copy of the TargetRTS. 

For example, to apply the changes from version 8000 to version 8002, go to the folder that contains the `TargetRTS` and `TargetRTS_changelog` folders and run this command:

```
patch -p3 < TargetRTS_changelog/8000_8002.patch
```

You can also downgrade the version of the TargetRTS by running the same command but with the `-R` flag.

!!! note
    The `patch` command is included in Linux and Unix-like operating systems, but on Windows you have to download it separately. You can for example get it through the [Git for Windows](https://gitforwindows.org/) set of tools.

The patch files in the `TargetRTS_changelog` folder have been created by a Bash script `TargetRTS/tools/createPatch.sh`. You can use this script if you have your version of the TargetRTS in a Git repo and want to produce a patch file for the changes you have made to the TargetRTS. You can then later use that patch file to apply your changes to a newer version of the TargetRTS.

Whether it's best to adopt changes in a standard TargetRTS into your version of the TargetRTS, or to do the opposite, i.e. adopt your changes into a standard TargetRTS, may depend on how big changes you have made. If your changes are small and limited the latter may be easiest, while if you have made substantial changes the former may be the better option.

## Change Log
Below is a table that lists all changes made in the TargetRTS since version 8000 (which were delivered with {$product.name$} 1.0.0). For changes in older versions of the TargetRTS, which were done for {$rtist.name$}, see [this document](https://model-realtime.hcldoc.com/help/topic/com.ibm.xtools.rsarte.webdoc/pdf/ModelRealTime_RoseRT_All_Changes_in_Cpp_TargetRTS.pdf).

| TargetRTS Version | Included Changes | 
|----------|:-------------|
| 8001 | [JSON Decoding](#json-decoder) | 
| 8002 | [Building without rtperl](#building-without-rtperl) <br> [JSON parser](#json-parser) <br> [Script for creating TargetRTS patch files](#script-for-creating-targetrts-patch-files) <br> [Pointers in JSON encoding/decoding](#pointers-in-json-encodingdecoding) | 


### JSON decoder
A new decoder class `RTJsonDecoding` is now available for decoding messages and data from JSON. JSON produced from data by the JSON Encoder (`RTJsonEncoding`) can be decoded back to (a copy of) the original data.

### Building without rtperl
New macros were added in makefiles to support building generated applications without using `rtperl`.

### JSON parser
A new class `RTJsonParser` can be used for parsing arbitrary JSON strings. It has a more general use than `RTJsonDecoding` which is specifically for decoding JSON that has been produced by `RTJsonEncoding`. See [this chapter](encoding-decoding.md#json-parser) for more information.

### Script for creating TargetRTS patch files
A Bash script `createPatch.sh` is now available in the `tools` folder of the TargetRTS. It can be used for producing patch files describing the differences between two versions of the TargetRTS. See [Patch Files](#patch-files) for more information.

### Pointers in JSON encoding/decoding
Data of pointer type is now encoded to a string by the JSON encoder (`RTJsonEncoding`) and can be decoded back to a memory address by the JSON decoder (`RTJsonDecoding`).