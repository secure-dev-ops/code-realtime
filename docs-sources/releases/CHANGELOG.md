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
