#include <ConnectParams.h>

ConnectParams::ConnectParams( void )
{
}

ConnectParams::~ConnectParams( void )
{
}

ConnectParams::ConnectParams( const ConnectParams & rtg_arg )
    : port_num( rtg_arg.port_num )
    , proxy( rtg_arg.proxy )
    , path_weight( rtg_arg.path_weight )
{
    for (int rtg_index0 = 8 - 1 ;rtg_index0 >= 0 ; -- rtg_index0 )
        hostname[ rtg_index0 ] = rtg_arg.hostname[ rtg_index0 ];
}

ConnectParams & ConnectParams::operator=( const ConnectParams & rtg_arg )
{
    if( this != &rtg_arg )
    {
        port_num = rtg_arg.port_num;
        for (int rtg_index0 = 8 - 1 ;rtg_index0 >= 0 ; -- rtg_index0 )
            hostname[ rtg_index0 ] = rtg_arg.hostname[ rtg_index0 ];
        proxy = rtg_arg.proxy;
        path_weight = rtg_arg.path_weight;
    }
    return *this;
}

int ConnectParams::doSomething( void ) const
{
return 1;
}

