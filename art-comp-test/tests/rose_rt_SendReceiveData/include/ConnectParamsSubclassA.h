#ifndef ConnectParamsSubclassA_h
#define ConnectParamsSubclassA_h

#include <ConnectParams.h>
// This is a subclass of the user-defined data type.
// The doSomething() operation of the ConnectParams derived class returns 2.
class [[rt::auto_descriptor]] ConnectParamsSubclassA : public ConnectParams
{
public:
    double subclassA_param;
    ConnectParamsSubclassA( void );
    virtual ~ConnectParamsSubclassA( void );
    ConnectParamsSubclassA( const ConnectParamsSubclassA & rtg_arg );
    ConnectParamsSubclassA & operator=( const ConnectParamsSubclassA & rtg_arg );
    virtual int doSomething( void ) const;
};
#endif /* ConnectParamsSubclassA_h */
