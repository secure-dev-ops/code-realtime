#ifndef ABSTRACT_H
#define ABSTRACT_H

class [[rt::auto_descriptor]] Abstract {
public:
    virtual bool doSomething() const = 0;
    virtual const Abstract* constSelf()    const    =     0   ;
    virtual void nonConstFunc() = 0;
    virtual int addAll(int a, int b) = 0;

    bool testAbstractDescriptor() const;
};

#endif // ABSTRACT_H
