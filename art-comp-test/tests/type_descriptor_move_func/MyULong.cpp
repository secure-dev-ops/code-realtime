#include <MyULong.h>
#include <RTStructures.h>

MyULong::MyULong( void )
{
}

MyULong::~MyULong( void )
{
}

MyULong::MyULong( const MyULong & rtg_arg )
{
}

MyULong & MyULong::operator=( const MyULong & rtg_arg )
{
    if( this != &rtg_arg )
    {
    }
    return *this;
}

void rtg_MyULong_copy( const RTObject_class * type, MyULong * target, const MyULong * source )
{
// ASSERT: MyULong does not have a copy function body!
}

