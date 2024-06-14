#ifndef CapsuleFactory_h
#define CapsuleFactory_h

#include <RTInjector.h>
#include "ConcreteLogger.h"

class CapsuleFactory : public RTActorFactoryInterface
{
public:
	CapsuleFactory() : RTActorFactoryInterface()
	{
		std::cout << "Inside constructor for CapsuleFactory ...\n";

		std::cout << "Calling registerCreateFunction ...\n";
		RTInjector::getInstance().registerCreateFunction("/logger",
			[this](RTController *c, RTActorRef *a, int index)
			{
				std::cout << "Creating ConcreteLogger with RTInjector registered create function\n";
				return new ConcreteLogger(c, a);
			});
	}

	RTActor *create(RTController *rts, RTActorRef *ref, int index) override
	{
		std::string id;
		RTActorRef *cp = ref;
		int i = -1;
		while (cp != nullptr)
		{
			if (i != -1)
			{
				id.insert(0, std::to_string(i));
				id.insert(0, ":");
			}
			id.insert(0, cp->getName());
			id.insert(0, "/");
			RTActor *c = cp->getOwner();
			if (c)
			{
				cp = c->getReference();
				i = c->getIndex();
				if (cp == RTMain::topReference())
					cp = nullptr; // Reached the top of the composite structure
			}
			else
				cp = nullptr;
		}
		std::cout << "Calling RTInjector::create for capsule part with id = " << id << "\n";

		return RTInjector::getInstance().create(rts, ref, index);
	}

	void destroy(RTActor* actor) override {
		delete actor;
	}

	static CapsuleFactory factory;
};

#endif /* CapsuleFactory_h */
