---
group: type_descriptors
---
Class `MyULong` defines protected copy constructor. In this case user has to add a custom definition of copy descriptor function, and this is what ModelRT would require:<br/>
`ERROR : type_descriptor_move_func::MyULong : The default 'Copy Function Body' requires a public copy constructor.`<br/>
But the default move descriptor function also would not work in this case. ModelRT does not generate move functions at all by default, but CodeRT does. When user defines a custom copy function, default move function should not be generated (similar to how C++ decides on this), and this example should compile fine.
