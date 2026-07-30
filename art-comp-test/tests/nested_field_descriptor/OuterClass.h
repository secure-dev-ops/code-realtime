#ifndef __OUTERCLASS__
#define __OUTERCLASS__

#include <RTFieldDescriptor.h>

class [[rt::auto_descriptor]] OuterClass {    
    int x;
    int y;

    public:
    static const RTFieldDescriptor rtg_OuterClass_fields[];

    class [[rt::auto_descriptor]] InnerClass {        
        int x;
        int y;
        int z;    
        
        public:
        static const RTFieldDescriptor rtg_InnerClass_fields[];
        InnerClass() {
            x = 3;
            y = 4;
            z = 5;
        }
        int getX() const {return x;}
        int getY() const {return y;}
        int getZ() const {return z;}
    };    

    OuterClass() {
        x = 1;
        y = 2;
    }
    int getX() const {return x;}
    int getY() const {return y;}
    
    InnerClass nested;
};

#endif // __OUTERCLASS__