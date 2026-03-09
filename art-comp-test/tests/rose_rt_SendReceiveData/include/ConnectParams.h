#ifndef ConnectParams_h
#define ConnectParams_h

// This is an example of a user-defined data type, instances of which can be easily transmitted between capsules.
// The doSomething() operation of the ConnectParams base class returns 1.
class [[rt::auto_descriptor]] ConnectParams
{
public:
    int port_num;
    char hostname[ 8 ];
    long proxy;
    float path_weight;
    ConnectParams( void );
    virtual ~ConnectParams( void );
    ConnectParams( const ConnectParams & rtg_arg );
    ConnectParams & operator=( const ConnectParams & rtg_arg );
    virtual int doSomething( void ) const;
};
#endif /* ConnectParams_h */
