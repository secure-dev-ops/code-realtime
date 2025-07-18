#ifndef MyClass_h
#define MyClass_h

#include "RTInteger.h"
#include "RTString.h"
#include "MyEnum.h"

class [[rt::auto_descriptor]] MyClass
{
public:
    bool a1;
    double a2;
    RTInteger a3;
    RTString a4;

    PickUpStrategy strategy;

    MyClass(bool b = false, double d = 3.14, int i = 0, RTString s = "default") :
            a1(b), a2(d), a3(i), a4(s), strategy(RIGHTFIRST) { }
};
#endif /* MyClass_h */
