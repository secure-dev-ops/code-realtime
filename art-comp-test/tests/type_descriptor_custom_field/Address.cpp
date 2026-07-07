#include <Address.h>

Address::Address() : _port(443) { }

RTinet_port Address::getPort() const {
    return _port;
}
