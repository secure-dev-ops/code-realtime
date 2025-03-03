---
group: cpp_code_generation
---
A class that is abstract because it contains at least one pure virtual function (either locally defined or inherited) should use special versions of the init, copy and move functions (RTAbstract_init, RTAbstract_copy and RTAbstract_move) since it cannot be instantiated.

Ensure that both multiple inheritance and multilevel inheritance work as expected.
-   Test1MyClass1 and Test1MyClass2, which involve multiple and multilevel inheritance, should correctly identify whether a pure virtual function is present in a parent class.

Ability to inherit a class from another file:
-   Test2MyClass inherits from TestAbstractClass, which is present in another file, and should correctly determine whether the current class is Abstract or not.
-   Test3MyClass to Test10MyClass are designed to test the load on multilevel inheritance. These classes inherit from another file using #include.