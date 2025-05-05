#include "Types.h"

#if OBJECT_ENCODE
int rtg_MyString_encode(const RTObject_class* type, const MyString* source, RTEncoding* coding )
{
    return coding->put_string(source->c_str());
}
#endif

#if OBJECT_ENCODE
int rtg_MyVector_encode(const RTObject_class* type, const MyVector* source, RTEncoding* coding) {
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
