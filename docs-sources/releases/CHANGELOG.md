# 0.0.6 (2023-03-09 18:28)
1. Java 17 is now required for running the Art language server. Using Java 17 instead of Java 11 gives some performance improvements and enables use of more modern Java. Information about which Java version that is used is printed in the Art Server output channel when the RTist in Code extension is activated.
2. The popup menu that appears when pressing Ctrl+Space in a diagram now contains commands for navigating to the other kinds of diagram for the same Art element. For example, in a state diagram for capsule "X" there are commands for opening the class or structure diagram of capsule "X".
3. It's now possible to open more than one diagram in one go. You can select multiple Art files in the Explorer, and then invoke a command for opening diagrams from the context menu. If a file contains multiple root Art elements, the diagram will be opened for the first one.
4. A diagnostic icon (error, warning or information) that is shown in a diagram now has a tooltip that shows the diagnostic message as well as a hyperlink to the documentation.
5. RTist in Code now provides a Walkthrough guide on the Welcome page. The Walkthrough guides new users to how to build and run a sample application.
6. Diagram properties set in the Properties view can now be restored to their default value by means of a "Restore default" trashcan button that appears for properties that have a non-default value. The presence of this button also helps to highlight those properties that have been set to a non-default value.
7. States, pseudo states and transitions can now be deleted by selecting them in a state diagram and pressing the `Delete` key. More than one such element can be deleted at the same time by using Ctrl+click for selecting multiple symbols or lines before pressing the `Delete` key.
8. The form-based TC editor now shows a TC property name as a hyperlink in case a value is set for that property in the .tcjs file. The hyperlink is useful for navigation and also helps to highlight which TC properties that have non-default values set.
9. The form-based TC editor now shows a trashcan button for properties that have a value set. The button can be used for deleting the value (i.e. to restore the default value of the property) and also helps to highlight which TC properties that have non-default values set.
10. The form-based TC editor now updates immediately when a TC property is modified in the .tcjs file. It's no longer necessary to save the .tcjs file for changes to be reflected.
11. Choices and junctions can now be created with Content Assist in the Art text editor inside a state machine and inside a composite state.
12. It's now possible to build a library, rather than an executable, from a TC. If the built TC has the `topCapsule` property set an executable will be built. Otherwise a library will be built.

# 0.0.5 (2023-01-26 06:59)
1. Common diagram commands can now be invoked using the keyboard by pressing Ctrl+Space and selecting the command in the popup menu that appears. The following commands are available: Zoom In, Zoom Out, Center, Expand All, Collapse All
2. The presence of internal transitions on a state is now shown by means of an icon on the state symbol in a state diagram. As before the internal transitions will be shown in the Properties view if such a state symbol is selected.
3. When navigating to an element in an Art file the text editor will now automatically scroll both vertically and horizontally (if necessary) to make sure the element becomes visible.
4. TC properties are now validated when edited (both textually and in the UI), and detected problems are reported. For example, it's validated that the specified top capsule exists and that the C++ language standard is set to a valid value.
5. Custom colors can now be specified for all elements in state diagrams (transitions, states and pseudo states). You can directly change the color from the diagram Properties view (i.e. it's no longer necessary to first navigate to the Art file and change the color there).
6. Code formatting and content assist was improved to make rt::properties sections foldable in the Art editor.
7. A new command "Fold All Properties" was added. It collapses all rt::properties sections in an Art file (similar to how "Fold All C++ Code" works for C++ code sections). It can be useful for Art files that contain lots of properties.
8. The entry and exit actions of a composite state can now be folded in the Art file, like other C++ code snippets. The command "Fold All C++ Code" will therefore be able to fold also these code snippets.
9. Code generation now supports entry and exit actions for states.
10. State diagrams now show diagnostics (errors, warnings and informations) using icons on symbols and lines. A new preference (`rtistic.diagram.showDiagnostics`) controls if they should be shown or not.
11. More information is now printed in the Art Build output channel during a build. For example, various useful messages emitted by the C++ code generator may now be printed there. Messages emitted by build tools, e.g. the C++ compiler, are still printed in the Terminal view. In case the build fails a hyperlink to open the Terminal will be present in the Art Build output channel.
12. A target configuration for the latest version of the GCC compiler (ver. 12) on Linux is now provided.

# 0.0.4 (2022-12-21 13:11)

1. A target configuration for the latest version of the MinGw compiler (ver. 12.2) is now provided.
2. Better support for Linux platform.
3. Improved makefile generation for incremental builds.
4. More information for internal transitions are now shown in the Properties view. The triggers of the internal transitions are shown in a similar way as in the Outline view. Also, the blue and yellow icons representing the effect and guard code snippets for the internal transitions are shown and can be double-clicked in order to navigate to the code snippets in the Art file.
5. If a port has multiplicity > 1 it is now shown in structure diagrams.
6. The form-based TC editor is now automatically refreshed when the underlying .tcjs file is modified and saved.
7. It's now possible to navigate to the top capsule from a TC file by ctrl+click on the capsule name.
8. Content assist (ctrl+space) is now supported for TC property values. Valid values appear in a popup when typing the = character. If there is not a fixed list of valid values, the expected value type (e.g. string) will be shown.
9. Cross-references now bind across workspace folders. This makes it possible to split an application into several workspace folders. For example, Art files built into a library can now be placed in its own folder, and be used from Art files outside that folder.
10. A composite state can now only be expanded if it contains at least one nested state. Previously the Expand button was shown also when the state only contained entry or exit points, which was misleading since expanding such a state didn't reveal anything new that could not already be seen.
11. Attempting to open a diagram using the Art editor context menu now works even when the cursor is not placed within an Art element that can be shown in the diagram. In this case a "quick pick" will appear where you can choose one of the elements that are present in the Art file. Hence, this behavior is now the same as when you open diagrams from the Explorer context menu.
12. Protocols now support the rt::header_preface and rt::header_ending code snippets. In particular rt::header_preface is useful for including header files with user-defined types used in the protocol.
13. A new output channel called Art Server is now available and can be seen in the Output view. It's used by the Art language server for printing diagnostic messages (usually internal errors), and can be useful for troubleshooting problems.
14. A new output channel called Art Build is now available and can be seen in the Output view. It's used when building a TC. For example, messages are printed when a build starts and finishes.
15. The editor title for diagrams now contain the name of the Art element. This makes it easier to work with multiple open diagrams at the same time.
16. Content assist now supports creating non-triggered transitions in a state machine.
17. Code generation now supports transition guards, events with parameters of predefined types, connectors between local port and inner structure.
18. It's now possible to set custom colors to be used in diagrams by means of a new color property. Currently this is supported for initial and triggered transitions.

# 0.0.3 (2022-11-23)

1. The graphical appearance of symbols in class diagrams has improved. Now a line separates the name from properties such as ports and events. Also, icons were added for the properties to make it easier to understand the diagram.
2. The Expand All/Collapse All commands in the Properties view now work also for structure diagrams. Cycles in the composition hierarchy are detected and reported with an error message if found.
3. It's now possible to build a TC using a context menu command **Build**. And if it produces an executable it's possible to launch it with another context menu command **Run**. Of course, it's still possible to manually build and run from the terminal.
4. The RTist in Code [documentation](https://opensource.hcltechsw.com/rtist-in-code/) was extended with several new topics and the landing page was improved.
5. New color themes for better syntax highlighting of Art files (and embedded C++ code) are now available. See this [topic](https://opensource.hcltechsw.com/rtist-in-code/working-with-art/art-editor/#syntax-coloring) for more information.
6. It's now possible to edit TC properties using a form-based editor, as an alternative to directly editing the .tcjs file. The form-based editor is invoked from a context menu on the TC called **Edit Properties (UI)**.
7. New TC properties are now supported for specifying which make command to use for building generated code, as well as the make arguments. The new properties are [`makeCommand`](http://opensource.hcltechsw.com/rtist-in-code/building/transformation-configurations/#makecommand) and [`makeArguments`](http://opensource.hcltechsw.com/rtist-in-code/building/transformation-configurations/#makearguments).
8. The existing TC properties `targetProject` and `targetServicesLibrary` were renamed to `targetFolder` and `targetRTSLocation` respectively.
9. Fixed several Linux specific problems in the language server.
10. The GLSP library was uplifted to version 1.0. Read about the improvements it brings to diagrams [here](https://eclipsesource.com/blogs/2022/07/06/eclipse-glsp-1-0-release-is-here/).
11. A problem with automatically expanding symbols when doing a Rename from a diagram was fixed.
12. When renaming an element, for which one or several diagrams have been opened, the diagrams stay open (previously they were automatically closed as a side-effect of the rename).
13. Navigation from a C++ code snippet to generated C++ code using the hyperlink in the code snippet tooltip now works even if the cursor is not placed inside the code snippet.

# 0.0.2 (2022-10-20)

* First public release. Initial support for the Art language, graphical diagrams, transformation configurations and C++ code generation.
