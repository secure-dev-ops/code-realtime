#ifndef inet_address_h
#define inet_address_h

struct RTFieldDescriptor;
class [[rt::auto_descriptor]] inet_address
{
public:
    static const RTFieldDescriptor rtg_inet_address_fields[];
private:
    char b[ 4 ];
};

#endif /* inet_address_h */
