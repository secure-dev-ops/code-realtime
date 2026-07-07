#ifndef rtg_TraceEvent_h
#define rtg_TraceEvent_h

#include <TraceHandle.h>
#include <X.h>

class [[rt::auto_descriptor]] TraceEvent
{
public:
    char * data;
    TraceHandle handle;
    X x;
};

#endif /* rtg_TraceEvent_h */
