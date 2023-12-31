{$product.name$} provides several settings that can be used for configuring many aspects of how it works. To view these settings perform **File - Preferences - Settings** and then select **Extensions - {$product.name$}**.

Below is a table that lists all {$product.name$} settings. Each setting is described in a section of its own below the table.

<p id="settings"/>

| Setting | Id | Purpose | 
|----------|:-------------|:-------------|
| [Language Server - Jvm](#jvm) | code-rt.languageServer.jvm | Set the JVM to use for running the {$product.name$} language server
| [Language Server - Jvm Args](#jvm-args) | code-rt.languageServer.jvmArgs | Set arguments for the JVM that runs the {$product.name$} language server
| [Validation - Rule Configuration](#rule-configuration) | code-rt.validation.ruleConfiguration | Customize which validation rules to run on Art files and their severity
| [Build - Output Folder](#output-folder) | code-rt.build.outputFolder | Set the location where to place generated code
| [Build - Cancel On Error](#cancel-on-error) | code-rt.build.cancelOnError | Cancel a launched build if errors exist in TCs or Art files
| [Diagram - Show Junction Names](#show-junction-names) | code-rt.diagram.showJunctionNames | Show junction names on state diagrams
| [Diagram - Show Choice Names](#show-choice-names) | code-rt.diagram.showChoiceNames | Show choice names on state diagrams
| [Diagram - Show Entry Exit Point Names](#show-entry-exit-point-names) | code-rt.diagram.showEntryExitPointNames | Show entry/exit point names on state diagrams
| [Diagram - Show Transition Names](#show-transition-names) | code-rt.diagram.showTransitionNames | Show transition names on state diagrams
| [Diagram - Show Diagnostics](#show-diagnostics) | code-rt.diagram.showDiagnostics | Show error, warning and information icons on diagrams

## Language Server
Settings related to running the {$product.name$} language server.

### Jvm
When the {$product.name$} extension gets activated it will attempt to launch its language server. If this setting holds a valid location of a Java VM (JDK or JRE) it will be used for running the language server. Otherwise the `JAVA_HOME` environment variable will be used. If that is also not set, it's required to have `java` in the path. See [Setup Java](installing.md#setup-java) for more information.

### Jvm Args
By default the JVM is launched with the argument `-Xmx4024m`. Refer to the documentation of your JVM for a list of available JVM arguments.

## Validation
Settings related to validation of Art files.

### Rule Configuration
This setting can be used for customizing which validation rules that should run when you edit Art files. You can also completely disable those validation rules you don't want to run. For more information see [this page](validation.md#configuring-validation).

## Build
Settings related to building Art files, via C++ code, to libraries or executables.

### Output Folder
This setting specifies a folder where all generated code will be placed. More precisely, it's used for resolving relative paths specified in TCs (using the TC property [`targetFolder`](building/transformation-configurations.md#targetfolder)). If you leave this setting unset, relative paths will instead be resolved against the location of the TCs. The `Output Folder` must be specified as an absolute path that points at a writable folder in the file system.

### Cancel On Error
When a TC is built the Problems view is scanned to see if there are errors reported on the built TC or its prerequisites, as well as all Art files that will be built. If at least one such error is found it's recommended to cancel the build, fix the errors and then redo the build again. The default value for this setting is `Prompt` which means you will be prompted by a dialog where you can choose if you want to cancel the build, or proceed anyway. In the latter case you may encounter compilation errors when generated code is compiled or run-time problems when the built executable is run. Therefore you should only proceed if you are confident that the errors are safe to ignore. You may set this setting to `Always` to suppress the dialog and always cancel the build when errors are present. You can also (but this is not recommended) set the setting to `Never` to always ignore any errors and proceed with the build anyway.

## Diagram
Settings related to graphical diagrams that visualize elements of Art files.

### Show Junction Names
Junctions usually have short and uninteresting names, and are therefore by default not shown on state diagrams. Turn on this setting to make them visible. Note that a certain state diagram may override this setting by means of setting the corresponding diagram property in the diagram's Properties view. See [Diagram Filters](working-with-art/diagrams.md#diagram-filters) for more information.

### Show Choice Names
Choices usually have short and uninteresting names, and are therefore by default not shown on state diagrams. Turn on this setting to make them visible. Note that a certain state diagram may override this setting by means of setting the corresponding diagram property in the diagram's Properties view. See [Diagram Filters](working-with-art/diagrams.md#diagram-filters) for more information.

### Show Entry Exit Point Names
Entry and exit points usually have short and uninteresting names, and are therefore by default not shown on state diagrams. Turn on this setting to make them visible. Note that a certain state diagram may override this setting by means of setting the corresponding diagram property in the diagram's Properties view. See [Diagram Filters](working-with-art/diagrams.md#diagram-filters) for more information.

### Show Transition Names
If you feel that showing the names of transitions makes state diagrams too cluttered you can turn off this setting. By default they are shown. Note that a certain state diagram may override this setting by means of setting the corresponding diagram property in the diagram's Properties view. See [Diagram Filters](working-with-art/diagrams.md#diagram-filters) for more information.

### Show Diagnostics
By default diagram elements will be decorated by icons corresponding to diagnostics generated by [validation rules](validation.md#validation-rules). Turn off this setting if you don't want to see these icons on diagrams.

There are three kinds of diagnostic icons corresponding to the problem severity levels Error, Warning and Information. See [Problem Severity](validation.md#problem-severity) for more information.