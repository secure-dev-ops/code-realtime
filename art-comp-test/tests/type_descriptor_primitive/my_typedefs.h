#ifndef my_typedefs_h
#define my_typedefs_h

// the use of type descriptor on typedef means that referenced type must have a type descriptor
[[rt::auto_descriptor]] typedef bool my_bool;
[[rt::auto_descriptor]] typedef int my_int;
typedef float [[rt::auto_descriptor]] my_float;
[[rt::auto_descriptor]] typedef double my_double;
using my_long [[rt::auto_descriptor]] = long;

#endif
