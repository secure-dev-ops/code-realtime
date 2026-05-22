#ifndef __POINT__
#define __POINT__

#include "RTStructures.h"
#include <vector>
#include <string>

struct [[rt::auto_descriptor]] Point {
    int x;
    int y;

    struct [[rt::auto_descriptor]] NestedPoint {
        int x;
        int y;
        int z;
    };

    enum [[rt::auto_descriptor]] Colors {
        red,green,yellow
    };

    enum class [[rt::auto_descriptor]] ScopedColors {
        blue,white,black
    };

    [[rt::auto_descriptor]] typedef unsigned int Precision; 
    typedef std::string [[rt::auto_descriptor]] MyString;

    using MyVector [[rt::auto_descriptor]] = std::vector<int>; 

    NestedPoint nested;
    Colors color;
    ScopedColors scopedColor;
    Precision precision;
    MyString str;
    MyVector myVector;
    //NestedPoint nestedPoints[2];

    Point() {
        x = 1;
        y = 2;
        nested.x = 3;
        nested.y = 4;
        nested.z = 5;
        color = green;
        scopedColor = ScopedColors::blue;
        precision = 11;
        str = "Hello there!";
        myVector = {1,2};
        /*nestedPoints[0].x = 6;
        nestedPoints[0].y = 7;
        nestedPoints[0].z = 8;
        nestedPoints[1].x = 9;
        nestedPoints[1].y = 10;
        nestedPoints[1].z = 11; */
    }
};

// When customizing a type descriptor function for a nested type we use the "mangled" name ('::' replaced by '_').
int rtg_Point_Precision_encode(const RTObject_class* type, const Point::Precision* source, RTEncoding* coding );
int rtg_Point_MyVector_encode(const RTObject_class* type, const Point::MyVector* source, RTEncoding* coding);
int rtg_Point_MyString_encode(const RTObject_class* type, const Point::MyString* source, RTEncoding* coding);

#endif // __POINT__