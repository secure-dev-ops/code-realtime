---
group: cpp_code_generation
---
Test code generation for redefined ports.
Check generated descriptors with assertions during test case execution.
Port `FuncPort` is redefined twice, each time with the new protocol. In generated `D::rtg_ports` offset macro must use qualified reference to `FuncPort` from capsule `A` where port is originally defined:<br/>
`RTOffsetOf( D, A::FuncPort )`
