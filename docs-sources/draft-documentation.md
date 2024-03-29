Draft documentation, not yet included in the product
====================================================

**Building - Transformation Configurations - capsuleFactory**
The capsule factory is specified by means of a C++ expression that must have the type `RTActorFactoryInterface*`. If the expression contains the variable `$(CAPSULE_CLASS)` it will be replaced with the name of the C++ class for the capsule. This can be useful for implementing a generic capsule factory which takes the capsule class as a template parameter.
===

**TargetRTS - Capsule Factory - Global Capsule Factory**
If the expression specified in the [`capsuleFactory`](../building/transformation-configurations.md#capsulefactory) property contains the variable `$(CAPSULE_CLASS)` it will be replaced with the name of the C++ class that is generated for the capsule. This can be useful for implementing a generic capsule factory which takes the capsule class as a template parameter.
===

**The Art Language - State Machine - Transition - Frequent Transition**

#### Frequent Transition
Sometimes you may have a state where one or a few outgoing transitions can be expected to execute much more frequently than others. You can then set a `frequent` [property](#property) on the transition trigger that you expect will trigger the transition frequently. The Art compiler uses this information to optimize generated C++ code so that such transition triggers are evaluated before other triggers that are expected to trigger the transition less frequently. 

``` art
interrupted: Working -> Stopped on [[rt::properties(
            frequent=true
        )]] external.interrupt
        `
            // Interrupted while working...
        `;
```

!!! note 
    The frequent property relies on optimization features in the C++ compiler that may or may not be available depending on which target compiler that is used. Only use frequent transitions if profiling has shown that you have a need to do this optimization.

========================================================
**The Art Language - Template**

## Template
A template is a type that is parameterized by means of template parameters to make it more generic. When a template is used (a.k.a. instantiated), actual template parameters must be provided that match the formal template parameters defined in the template. Both [capsules](#capsule) and [classes](#class-with-state-machine) can have template parameters. Just like in C++ two kinds of template parameters are supported:

* **Type template parameter**

Replaced with a type when the template is instantiated.

* **Non-type template parameters**

Replaced with a non-type, for example a constant value, when the template is instantiated.

Template parameters may have defaults that will be used if a matching actual template parameter is not provided when instantiating the template.

Below is an example of a capsule and a class with template parameters, some of which have defaults specified. The keywords `typename` and `class` can both be used for defining a type template parameter. A non-type template parameter is defined by specifying its type as a C++ code snippet.

``` art
template <typename T = `int`, `int` p1 = `5`>
capsule TemplateCapsule { 
    [[rt::decl]]
    `
        void func(T arg1) {
            // impl
        }
    `

    service port mp : MachineEvents[`p1`];

    statemachine {
        state State;
        initial -> State;
    };
};

template <typename T, class U, `int` p1>
class TemplateClass : `Base<T,U,p1>` {
    statemachine {
        state State;
        initial -> State;
    };
};
```
Template parameters can only be used from C++ code snippets, and above you see some examples of how they can be used. It's not possible to instantiate a template in Art itself. For example, even if class `Base` above was defined as an Art class, a C++ code snippet has to be used since it has template parameters.

========================================================
**The Art Language - Property**

### frequent
Triggers for which this property is `true` will lead to generated code that handles these triggers faster than other triggers. This is done by placing their if-statements early in the `rtsBehavior` function to ensure that as little code as possible needs to execute when dispatching a message for a frequent trigger.

| [Capsule](#capsule), [Class](#class-with-state-machine) | [generate_file_header](#generate_file_header) | Boolean | true 
| [Capsule](#capsule), [Class](#class-with-state-machine) | [generate_file_impl](#generate_file_impl) | Boolean | true
| [Capsule](#capsule), [Class](#class-with-state-machine), [Protocol](#protocol-and-event), [Port](#port), 

| [Class](#class-with-state-machine), [Protocol](#protocol-and-event) | [version](#version) | Integer | 0
| [Class](#class-with-state-machine) | [generate_descriptor](#generate_descriptor) | Enumeration (true, false, manual) | true
| [Class](#class-with-state-machine) | [kind](#kind) | Enumeration (_class, struct, union) | _class
| [Class](#class-with-state-machine) | [generate_class](#generate_class) | Boolean | true
| [Class](#class-with-state-machine) | [generate_statemachine](#generate_statemachine) | Boolean | true
| [Class](#class-with-state-machine) | [const_target_param_for_decode](#const_target_param_for_decode) | Boolean | false
| [Class](#class-with-state-machine) | [default_constructor_generate](#default_constructor_generate) | Boolean | true
| [Class](#class-with-state-machine) | [default_constructor_explicit](#default_constructor_explicit) | Boolean | false
| [Class](#class-with-state-machine) | [default_constructor_inline](#default_constructor_inline) | Boolean | false
| [Class](#class-with-state-machine) | [default_constructor_default](#default_constructor_default) | Boolean | false
| [Class](#class-with-state-machine) | [default_constructor_delete](#default_constructor_delete) | Boolean | false
| [Class](#class-with-state-machine) | [default_constructor_visibility](#default_constructor_visibility) | 

### generate_file_header
By default a [capsule](#capsule) or [class](#class-with-state-machine) is translated to one header file (`.h`) and one implementation file (`.cpp`). Set this property to `false` to prevent generation of the header file, for example if you prefer to write it manually.

### generate_file_impl
By default a [capsule](#capsule) or [class](#class-with-state-machine) is translated to one header file (`.h`) and one implementation file (`.cpp`). Set this property to `false` to prevent generation of the implementation file, for example if you prefer to write it manually.


### generate_descriptor
By default a type descriptor will be generated for each [class](#class-with-state-machine). The TargetRTS uses the type descriptor to know how to initialize, copy, move, destroy, encode or decode an instance of that class. Set this property to `false` for classes that don't need a type descriptor. Set it to `manual` if the class needs a type descriptor but you want to implement it manually rather than using the implementation that is generated by default. Note that even if you set this property to `true` so that a default type descriptor is generated, you can still override individual type descriptor functions for the class.

### kind
By default a [class](#class-with-state-machine) is translated to a C++ class. You can use this property to instead translate it to a `struct` or `union`.

### generate_class
If set to `false` no C++ code will be generated for the class.

### generate_statemachine
If set to `false` code generation for the class' state machine will be suppressed. You can use this if the state machine is informal, and you prefer to implement it manually in another way.

### const_target_param_for_decode
By default a decode function uses a non-const `target` parameter. This is because usually a decode implementation must call non-const functions on the decoded object to populate it with data from the decoding. However, if it doesn't need to call such functions you can set this property so that the `target` parameter is declared as const.

### default_constructor_generate
If set to `false` a default (i.e. parameterless) constructor will not be generated for the class.

### default_constructor_explicit
If set to `true` the default (i.e. parameterless) constructor will be declared as explicit.

### default_constructor_inline
If set to `true` the default (i.e. parameterless) constructor will be declared as inline. It's implementation will then be generated into the header file.

### default_constructor_default
If set to `true` the default (i.e. parameterless) constructor will be declared as defaulted. This tells the compiler to synthesize a default constructor even if one normally would not be synthesized (for example because there is a user-defined constructor with parameters).

### default_constructor_delete
If set to `true` the default (i.e. parameterless) constructor will be declared as deleted. This will cause the compiler to generate an error if it is invoked. This can be used for preventing objects of the class to be created.

### default_constructor_visibility
This property can be used for setting the visibility of the default (i.e. parameterless) constructor. By default it will be `public` but you can change it either to `protected` or `private`.

