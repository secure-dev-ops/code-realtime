#ifndef my_stdint_h
#define my_stdint_h

#include <cstdint>

[[rt::auto_descriptor]] typedef int8_t my_int8;
typedef int16_t [[rt::auto_descriptor]] my_int16;
using my_int32 [[rt::auto_descriptor]] = int32_t;
[[rt::auto_descriptor]] typedef int64_t my_int64;

#endif
