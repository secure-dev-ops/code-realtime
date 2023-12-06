Draft documentation, not yet included in the product
====================================================
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