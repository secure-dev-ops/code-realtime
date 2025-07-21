#ifndef __MYDATA__
#define __MYDATA__

struct [[rt::auto_descriptor]] MyData {
    int x = 5;
};

extern MyData* sentObject;

#endif 

