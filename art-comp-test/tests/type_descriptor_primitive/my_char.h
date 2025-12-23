#ifndef my_char_h
#define my_char_h

struct RTObject_class;
class RTEncoding;
class RTDecoding;
[[rt::auto_descriptor]] typedef char my_char;
extern void rtg_my_char_init( const RTObject_class * type, my_char * target );
extern void rtg_my_char_copy( const RTObject_class * type, my_char * target, const my_char * source );
extern void rtg_my_char_destroy( const RTObject_class * type, my_char * target );
extern int rtg_my_char_encode( const RTObject_class * type, const my_char * source, RTEncoding * coding );
extern int rtg_my_char_decode( const RTObject_class * type, my_char * target, RTDecoding * coding );

#endif /* my_char_h */
