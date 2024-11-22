{$product.name$} lets you create stateful, event-driven realtime applications in C++.

It runs as an extension of Visual Studio Code or Eclipse Theia. Follow the [installation instructions](installing.md) for installing it.

{$product.name$} supports the [Art language](art-lang/index.md) which extends the C++ language with high-level concepts useful when designing stateful, event-driven realtime applications. Examples of such concepts include capsules, state machines and protocols. Art is a textual language, but also provides a graphical notation that includes class, state and structure diagrams.

{$product.name$} translates Art files into efficient C++ code which can be compiled on any target system. The generated code makes use of the [Target RunTime System](target-rts/index.md) which is a C++ library that implements the concepts of the Art language.

Watch this [video](https://www.youtube.com/watch?v=6kgg_oDGSQ8) to get an overview of how {$product.name$} uses the Art language for implementing stateful, event-driven realtime applications.

## Art History
The Art language as implemented in {$product.name$} builds on a foundation with a long history in industry. In the early 1990s the Canadian company ObjecTime Limited developed a language called [ROOM](https://www.researchgate.net/publication/221569173_Real-Time_Object-Oriented_Modeling_ROOM) to address the challenges of building realtime applications consisting of communicating state machines. ROOM introduced concepts such as capsules, protocols and ports and was first implemented in the tool ObjecTime Developer. This tool got adopted in a wide range of industrial domains for example telecom and embedded systems development.

In 2000 ObjectTime was acquired by Rational Software and ObjecTime Developer was merged with Rational Rose, a UML modeling tool. The result was Rational Rose RealTime (Rose RT). At the same time many of the ROOM language concepts made its way into the, by then, new modeling language called UML-RealTime.

In 2003 Rational Software was acquired by IBM which at the time was investing heavily in the Eclipse platform. As a result, work started to create an Eclipse-based tool as the successor of Rose RT. This new product got the name Rational Software Architect RealTime Edition (RSARTE) and was first released in 2007.

In 2016 HCL entered a partnership with IBM, which led to a rebranded version of RSARTE called HCL RTist. A few years later both RSARTE and RTist were renamed to [DevOps Model RealTime](https://model-realtime.hcldoc.com/help/topic/com.ibm.xtools.rsarte.webdoc/users-guide/overview.html).

Work on {$product.name$} began in 2020 with the aim of supporting other IDEs than Eclipse. As part of this effort a textual language syntax, Art, was developed. Hence it's fair to describe the Art language as a new syntax for concepts that have a rather old history and have already been used in the industry for more than 30 years. It should also be mentioned that the [Target RunTime System](target-rts/index.md) used in {$product.name$} is the same as is used in Model RealTime. In fact, the implementation of this C++ library started with ObjectTime Developer and has since then been gradually extended and modernized.