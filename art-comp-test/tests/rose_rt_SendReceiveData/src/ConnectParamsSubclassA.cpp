#include <ConnectParamsSubclassA.h>

ConnectParamsSubclassA::ConnectParamsSubclassA( void )
    : ConnectParams(  )
{
}

ConnectParamsSubclassA::~ConnectParamsSubclassA( void )
{
}

ConnectParamsSubclassA::ConnectParamsSubclassA( const ConnectParamsSubclassA & rtg_arg )
    : ConnectParams( rtg_arg )
    , subclassA_param( rtg_arg.subclassA_param )
{
}

ConnectParamsSubclassA & ConnectParamsSubclassA::operator=( const ConnectParamsSubclassA & rtg_arg )
{
    if( this != &rtg_arg )
    {
        ConnectParams::operator=( rtg_arg );
        subclassA_param = rtg_arg.subclassA_param;
    }
    return *this;
}

int ConnectParamsSubclassA::doSomething( void ) const
{
return 2;
}

