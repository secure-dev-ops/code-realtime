#ifndef typedef_Types_h
#define typedef_Types_h

#include "RTStructures.h"

#include <string>
typedef std::string [[rt::auto_descriptor]] MyString;
int rtg_MyString_encode(const RTObject_class* type, const MyString* source, RTEncoding* coding);

#include <vector>
using MyVector [[rt::auto_descriptor]] = std::vector<int>;
int rtg_MyVector_encode(const RTObject_class* type, const MyVector* source, RTEncoding* coding);

#endif
