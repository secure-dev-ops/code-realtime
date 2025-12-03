#ifndef NONABSTRACT_H
#define NONABSTRACT_H

#include "Abstract.h"
#include "RTLog.h"

class [[rt::auto_descriptor]] NonAbstract : public Abstract {
public:
    virtual bool doSomething() const override {        
        return true;
    }
    // Use of override keyword is not required
    virtual const Abstract* constSelf()    const  {
        return this;
    }

    virtual void nonConstFunc() override {        
    }

    virtual int addAll(int a, int b) {
        return a + b;
    }

    NonAbstract(const NonAbstract&) {
        // Copy constructor implementation
        Log::out << "NonAbstract copy constructor called." << std::endl;
    }

    NonAbstract() {
        // Default constructor implementation
        Log::out << "NonAbstract default constructor called." << std::endl;
    }

    bool testNonAbstractDescriptor() const;
};

#endif // NONABSTRACT_H
