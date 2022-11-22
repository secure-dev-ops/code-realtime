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
