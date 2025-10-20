#ifndef DATA_H
#define DATA_H

struct [[rt::auto_descriptor]] Data {
    int value;
    Data(int v = 0) : value(v) {}
};

struct [[rt::auto_descriptor]] Container {
    Data d; // Data directly contained in Container
    Data* pd; // Data indirectly contained in Container (pointer to Data)    
};

#endif // DATA_H