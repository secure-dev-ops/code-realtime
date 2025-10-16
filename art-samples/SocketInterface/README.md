# SocketInterface
This sample shows how you can use the RTCustomController to integrate socket communication into the controller event loop.

## Building and Running
Build `server.tcjs` and `client.tcjs`. Start the server from a console:

```
.\ReceiverSameThread.EXE -URTS_DEBUG=quit
```

The server starts and listens on a port for incoming socket communication from the client. If the default port is not appropriate in your environment you can change it in `CONSTANTS.cpp`.

Then start the client from another console:

```
.\SenderSameThread.EXE -URTS_DEBUG=quit
```

The client and server makes 10000 ping/pong roundtrip requests and terminate after that. The client then prints the time it took.
The client also has a periodic timer that times out every 100 ms. Scroll up in the client log to find the printouts `TCPClient: Timer timeout` and `TCPClient: waitForEvents - woken up`. Note that these printouts are made from different threads so they may come in any order. The purpose of the timer is to show that the client can both read data from the socket as well as waking up and processing messages from other threads (in this case a timeout message) in its event loop.