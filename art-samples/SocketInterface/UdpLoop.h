#ifndef UdpLoop_h
#define UdpLoop_h

class RTIOMonitor;
class UdpLoop {
    int sd;
    unsigned short port;
public:
    UdpLoop();
    UdpLoop( const UdpLoop & rtg_arg );
    UdpLoop & operator=( const UdpLoop & rtg_arg );
    const char * create( RTIOMonitor * monitor );
    bool transmit();
    bool receive( RTIOMonitor * monitor );
    ~UdpLoop();
};
#endif /* UdpLoop_h */
