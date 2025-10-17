#ifndef MYSTRUCT_H
#define MYSTRUCT_H

class RTObject_class;
extern const RTObject_class RTType_MyBool;

struct [[rt::auto_descriptor]] MyStruct {
    int a;
    [[rt::no_descriptor]] bool b;
    [[rt::no_type_modifier]] char c[3];
    [[rt::type_descriptor("RTType_MyBool")]] bool d;    
}; 

#endif // MYSTRUCT_H