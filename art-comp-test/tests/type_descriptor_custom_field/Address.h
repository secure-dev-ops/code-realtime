#ifndef Address_h
#define Address_h

#include <RTStructures.h>
#include <RTinet.h>
#include <CustomDescriptors.h>
struct RTFieldDescriptor;
class [[rt::auto_descriptor]] Address : public RTDataObject
{
public:
    static const RTFieldDescriptor rtg_Address_fields[];
private:
    RTinet_address _address;
    RTinet_port _port;
    RTString _host;

public:
    Address();
    RTinet_port getPort() const;
};

#endif /* Address_h */
