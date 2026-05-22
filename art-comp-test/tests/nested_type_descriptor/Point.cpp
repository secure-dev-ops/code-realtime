#include "Point.h"

#if OBJECT_ENCODE
int rtg_Point_Precision_encode(const RTObject_class* type, const Point::Precision* source, RTEncoding* coding )
{
    return coding->put_unsigned(*source);
}

int rtg_Point_MyString_encode(const RTObject_class* type, const Point::MyString* source, RTEncoding* coding )
{
    return coding->put_string(source->c_str());
}

int rtg_Point_MyVector_encode(const RTObject_class* type, const Point::MyVector* source, RTEncoding* coding) {
    int sum = 0;
    bool first = true;    
    sum += coding->write_string("[");
    for (auto i = source->begin(); i != source->end(); i++) {
    if (!first)
        sum += coding->write_string(",");
    first = false;
    sum += RTType_int.encode(&*i, coding);
    }
    sum += coding->write_string("]");
    return sum;
}

#endif