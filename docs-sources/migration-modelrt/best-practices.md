The sections below summarize experiences and best practises from completed migration projects.

## Art Exporter Warnings
It's typical to get a big number of warnings the first time you run the Art Exporter on a model. Each warning has an id that starts with 1, for example `WARNING[1002]`. Even if it's likely that the majority of these warnings are harmless and can be ignored, it's very much recommended that you read and understand each warning. Go through all warnings with a certain id. Once you have done that, and determined that those warnings are safe to ignore, you can disable them in the Model RealTime preferences at **RealTime Development - Build/Transformation - C++ - Rule Configuration**. For example, to disable all warnings with id 1002 add the rule configuration `X1002`.

For some warnings you may instead choose to update the Model RealTime model to get rid of them.

When a warning has been analyzed and you have either disabled it, or updated the model to get rid of it, then run the Art Exporter again to get a new (shorter) list of warnings. Then do the same for the next warning id and repeat until the Art Exporter does not report any warnings for your model.

## Post Migration Script
When you decide to make a change in the model to be migrated (for example to address an Art Exporter [warning](#art-exporter-warnings), or add a [missing include directive](#missing-include-directives)) it's of course best if the change can be made in a way that doesn't break the build of the model in Model RealTime. However, sometimes this may not be possible due to differences between how {$product.name$} and Model RealTime work. An alternative to making a breaking change in the Model RealTime model can be to instead update the migrated {$product.name$} files.

You can write a script (e.g. a Bash script) which can make such updates after the Art Exporter has run. Such a post migration script acts like a customization of the Art Exporter, and can also be useful for working around bugs or limitations. By applying the changes with a script rather than doing them manually, you can easily repeat the migration multiple times, something that is often needed during a migration project that can last several weeks for big models.

The sections below cover some known limitations of the Art Exporter which currently must be handled by a post migration script.

### Updating Names in Code Snippets
As explained in [Capsule Class Name](#capsule-class-name) there is a difference between Model RealTime and {$product.name$} in how capsule classes and capsule type descriptors are named. The Art Exporter tries to automatically update such references in code snippets. When it's able to detect and update such a name it will print a [warning](#art-exporter-warnings). It's strongly recommended that you review these warnings to confirm that the update is correct.

In some cases, however, the Art Exporter will fail to detect these names, and therefore not update them. This can for example happen if they are enclosed in conditional compilation blocks. If you get compilation errors caused by names that were not updated correctly, it's recommended to update them using a [post migration script](#post-migration-script) that can accurately detect and update the name.

## Capsule Class Name
In Model RealTime the C++ class that is generated from a capsule has the suffix `_Actor` appended to its name. {$product.name$} does not add this suffix in order to make code snippets more readable. To avoid a name clash with the type descriptor for the capsule (which in Model RealTime has the same name as the capsule), {$product.name$} adds the prefix `RTType_` to its name. This is consistent with the prefix used for all other type descriptors.

The Art Exporter scans code snippets and tries to automatically update references to a capsule class (remove `_Actor`) or its type descriptor (prepend `RTType_`). For each replacement made it will print a warning. For example:

```
WARNING[1012] : file:<URI> : Updated a supposed capsule class reference from "SomeCapsule" to "RTType_SomeCapsule" in code snippet "Guard".
```

It's recommended to manually confirm that the replacement that was done is correct. Once you have confirmed that each automatic replacement is correct you can turn off the warning 1012 as explained in [Art Exporter Warnings](#art-exporter-warnings).

## Missing Include Directives
In Model RealTime all generated files include the main TargetRTS header file `RTStructures.h`. No analysis is done to determine if this include is actually necessary or not. In {$product.name$} this include is only added for files that have a dependency on the TargetRTS. This makes compilation of C++ files that do not depend on the TargetRTS faster.

The Art Exporter has an option `Include TargetRTS headers in all exported C++ files`. If it is set an include of `RTStructures.h` will be added to all exported files, just like Model RealTime works. You may use this option as a quick way to resolve compilation errors caused by this missing include directive, but the recommended long term solution is to update the model to add the include directive only where it's required.

There may also be other include files that are missing in your model, but where the code generated by Model RealTime still compiles (because the required include file gets indirectly included through another include file). Also here the recommended solution is to update the model to add the missing include. Follow the general best practise in C++ which is:

1) If a file doesn't use anything from an included file, then remove the #include directive completely. Unnecessary include directives makes compilation slower and can lead to unwanted circular dependencies.

2) If a file uses only pointers or references to a type, then forward declare the type. Do not include the file where the type is defined.

3) For all other references to declarations, include the file that contains the declaration. Do not rely on that the file gets indirectly included through another included file.

## Variables in TC Properties
Model RealTime supports various [variables](https://model-realtime.hcldoc.com/help/topic/com.ibm.xtools.rsarte.webdoc/Articles/Building/Building%20CPP%20Applications/Applying%20Transformation%20Configurations/Dynamic%20Properties.html?cp=23_2_0_1_0_2) in TC properties. Some variables are predefined while others can be defined by the user in Eclipse preferences. Only a few of these variables can be automatically expanded by the Art Exporter.

If you have a variable in the exported TC that is not defined in {$product.name$} you can define an environment variable, either globally or in the shell from where you launch {$product.name$}. Some TC variables are expanded by {$product.name$}, while others are copied into the generated make file and will be expanded by the make tool. Note that some make tools (e.g. nmake) require environment variable names to be in all uppercase. For example, if you have used the predefined variable `${workspace_loc}` in inclusion paths or paths to object files, you may need to convert it to uppercase `${WORKSPACE_LOC}` in order for it to be expanded to the value of an environment variable with this name.

## Top Make Command
Model RealTime TCs have two properties `Top make command` and `Top make arguments` which are typically used for performing "pre-make" commands before the real build of the TC starts. For example, the top make command can invoke a script, copy files needed during the build etc.

{$product.name$} TCs don't have these properties. Instead you can create a [build task](../building/build-tasks.md) which can perform these commands. You can then either invoke this build task manually before building the TC, or create a combined build task which both performs the "pre-make" commands and then invokes the Art Compiler to build the TC.
