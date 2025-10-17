#include "MyStruct.h"
#include <RTStructures.h>

#if OBJECT_ENCODE
static int my_bool_encode( const RTObject_class *,
			const void           * source,
			RTEncoding           * coding )
{
    return coding->put_int( * static_cast<const bool *>(source) ? 1 : 0 );
}
#endif

// Incomplete type descriptor only used for custom encoding of booleans
const RTObject_class RTType_MyBool =
{
    nullptr
    , nullptr
    , "MyBool"
    , 0 /* RTVersionId */
    , sizeof( bool )
    , nullptr
    , nullptr
#if RT_VERSION_NUMBER >= 7105
    , nullptr
#endif
#if OBJECT_DECODE
    , nullptr
#endif
#if OBJECT_ENCODE
    , my_bool_encode
#endif
    , RTnop_destroy
    , 0
    , nullptr
};
