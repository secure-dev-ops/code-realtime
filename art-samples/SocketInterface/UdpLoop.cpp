#include <UdpLoop.h>

#include <RTIOMonitor.h>
#include <RTinet.h>
#include <RTTimespec.h>
UdpLoop::UdpLoop()
	: sd(INET_NO_SOCKET), port(0U) {
}

UdpLoop::UdpLoop(const UdpLoop &rtg_arg)
	: sd(rtg_arg.sd), port(rtg_arg.port) {
}

UdpLoop &UdpLoop::operator=(const UdpLoop &rtg_arg) {
	if (this != &rtg_arg) {
		sd = rtg_arg.sd;
		port = rtg_arg.port;
	}
	return *this;
}

const char *UdpLoop::create(RTIOMonitor *monitor) {
	if (sd != INET_NO_SOCKET)
		RTinet_close(sd);

	const char *failure = nullptr;

	if ((sd = RTinet_UDP_create()) == INET_NO_SOCKET) {
		failure = "Failed to create internal UDP socket";
	}
	else {
		RTinet_address address;

		if (RTinet_bind(sd, nullptr, 0) == 0) {
			failure = "Failed to bind internal UDP socket";
		}
		else if (RTinet_getname(sd, &address, &port) == 0) {
			failure = "Failed getsockname on internal UDP socket";
		}
		else {
			monitor->add(sd, RTIOMonitor::CanRead);
			return nullptr;
		}

		RTinet_close(sd);
	}

	return failure;
}

bool UdpLoop::transmit()
{
	if (sd != INET_NO_SOCKET) {
		char anything = '!';

		if (RTinet_sendto(sd, &anything, 1, &RTinet_loopback, port) >= 0)
			return true;
	}

	return false;
}

bool UdpLoop::receive(RTIOMonitor *monitor) {
	static const RTTimespec awhile(1L, 0L);

	if (monitor->wait(&awhile) <= 0) {
		// timeout or error
		return true;
	}
	else if ((monitor->status(sd) & RTIOMonitor::CanRead) == 0) {
		return false;
	}
	else {
		char anything;
		RTinet_address source_address;
		RTinet_port source_port;

		(void)RTinet_recvfrom(sd,
							  &anything, (int)sizeof(anything),
							  &source_address, &source_port);

		return true;
	}
}

UdpLoop::~UdpLoop() {
	if (sd != INET_NO_SOCKET)
		RTinet_close(sd);
}
