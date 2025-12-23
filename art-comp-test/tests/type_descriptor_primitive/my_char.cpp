#include <my_char.h>
#include <RTStructures.h>

void rtg_my_char_init( const RTObject_class * type, my_char * target )
{
*target = 0;

}

void rtg_my_char_copy( const RTObject_class * type, my_char * target, const my_char * source )
{
*target = *source;

}

void rtg_my_char_destroy( const RTObject_class * type, my_char * target )
{
// No destroy needed.  Built in function that does nothing is: RTnop_destroy();
(void)type;
(void)target;

}

int rtg_my_char_encode( const RTObject_class * type, const my_char * source, RTEncoding * coding )
{
#if OBJECT_ENCODE
return coding->put_char(*source);
#else
return 0;
#endif

}

int rtg_my_char_decode( const RTObject_class * type, my_char * target, RTDecoding * coding )
{
#if OBJECT_DECODE
return coding->get_char(*target);
#else
return 0;
#endif

}

