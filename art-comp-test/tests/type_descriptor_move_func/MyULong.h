#ifndef MyULong_h
#define MyULong_h

struct RTObject_class;
class [[rt::auto_descriptor]] MyULong
{
public:
    MyULong( void );
    virtual ~MyULong( void );
protected:
    MyULong( const MyULong & rtg_arg );
public:
    MyULong & operator=( const MyULong & rtg_arg );
};
extern void rtg_MyULong_copy( const RTObject_class * type, MyULong * target, const MyULong * source );
#endif /* MyULong_h */
