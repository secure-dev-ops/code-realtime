#ifndef TraceHandle_h
#define TraceHandle_h

struct RTObject_class;
class RTEncoding;
class RTDecoding;

[[rt::auto_descriptor]] typedef unsigned TraceHandle;

extern void rtg_TraceHandle_init( const RTObject_class * type, TraceHandle * target );
extern void rtg_TraceHandle_copy( const RTObject_class * type, TraceHandle * target, const TraceHandle * source );
extern void rtg_TraceHandle_destroy( const RTObject_class * type, TraceHandle * target );
extern int rtg_TraceHandle_encode( const RTObject_class * type, const TraceHandle * source, RTEncoding * coding );
extern int rtg_TraceHandle_decode( const RTObject_class * type, TraceHandle * target, RTDecoding * coding );

#endif
