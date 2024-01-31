A capsule factory is responsible for creating and destroying instances of a capsule. The TargetRTS has a default capsule factory which implements the default rules for capsule instance creation and destruction in a capsule part. These rules are:

1. A capsule instance is created using the `new` operator and destroyed using the `delete` operator.
2. The default capsule constructor is used when creating the instance, i.e. the constructor that just takes the [two mandatory parameters](../art-lang/index.md#capsule-constructor).
3. A capsule instance is run by the same thread (i.e. [RTController](../targetrts-api/class_r_t_controller.html)) as runs the container capsule instance (unless a specific thread is provided).
4. A capsule instance is inserted into the first free index of the capsule part (unless a specific index is provided).
5. The type of the capsule part is used for deciding the dynamic type of the created capsule instance (unless a specific capsule type is provided).

When you incarnate a capsule into an optional part using the [incarnate()](../targetrts-api/class_frame_1_1_base.html) functions of a [Frame](../targetrts-api/struct_frame.html) port, you can customize rules 3, 4 and 5 above by using different overloads of  `incarnate()`. However, if you want to customize rules 1 and/or 2, or incarnate a fixed part, you need to provide your own capsule factory. This can be done in a few different ways.

## Local Capsule Factory
You can provide a local capsule factory for a part by implementing the `rt::create` and/or `rt::destroy` code snippets. For an example see [Part with Capsule Factory](../art-lang/index.md#part-with-capsule-factory).

You can also provide a local capsule factory in a more dynamic way when you incarnate an optional part by calling `incarnateCustom()` instead of `incarnate()`. For an example see [Capsule Constructor](../art-lang/index.md#capsule-constructor). However, note that in this case it's only possible to provide the `create` implementation of the capsule factory, and capsule instances created that way will always be deleted using the `delete` operator.

Scenarios where a local capsule factory could be useful include:

* Providing arguments for a custom capsule constructor when creating a capsule instance.
* Creating a capsule instance in a fixed part and let it be run by a different thread than what runs the container capsule instance.
* Incarnate a fixed part by creating an instance of a capsule that inherits from the capsule that types the part.

## Global Capsule Factory
A global capsule factory will be used for creating and destroying capsule instances in *all* capsule parts in the application, except those for which a [local capsule factory](#local-capsule-factory) has been provided. Implement a global capsule factory by means of a class that inherits [`RTActorFactoryInterface`](../targetrts-api/class_r_t_actor_factory_interface.html). You need to implement the `create()` and `destroy()` functions. Then define an object of this class and set the [`capsuleFactory`](../building/transformation-configurations.md#capsulefactory) TC property to the address of that object.

Here is an example of how a global capsule factory can be implemented in an Art file called `CapsuleFactory.art`:

``` art
[[rt::decl]]
`
class CapsuleFactory : public RTActorFactoryInterface {
public:	
	RTActor *create(RTController *rts, RTActorRef *ref, int index) override {

		// Create capsule instance here
	}

	void destroy(RTActor* actor) override {
		// Delete capsule instance here
	}

	static CapsuleFactory factory;
};
`

[[rt::impl]]
`
CapsuleFactory CapsuleFactory::factory;
`
```

In the TC, specify the capsule factory object and make sure the capsule factory header file gets included everywhere:

``` js
tc.capsuleFactory = "&CapsuleFactory::factory";
tc.commonPreface = `
#include "CapsuleFactory.art.h"
`;
```

Scenarios where a global capsule factory could be useful include:

* Allocating capsule instances in a memory pool by using the placement new operator.
* Logging capsule instance creation and destruction.
* Customizing creation of certain capsule instances by means of [dependency injection](dependency-injection.md).