# Distributed PingPong
A distributed [DevOps Code RealTime](https://www.hcl-software.com/devops-code-realtime) application consisting of two executables that send ping and pong messages back and forth. The applications communicate with each other using the library [TCP server](../TcpServer/).

## Usage
Start each application with command-line arguments specifying a local and remote port. For example:
```
Top.EXE -URTS_DEBUG=quit -port=15000 -remotePort=16000
```

In this case the started executable will listen for incoming messages on port 15000 and send outgoing messages to port 16000. The other application should then be started with the reversed arguments, i.e. with `-port=16000 -remotePort=15000`. It is assumed that both applications run on the same machine. If you want to run them on separate machines, edit `PingPongServer::init()` to add another command-line argument for specifying the remote hostname.

Initially both applications will wait for each other to send the first event, so nothing will happen. There are several ways to make the ping pong game start:
* pass the `-injectFirstPing` argument to one of applications. Then the first message will be injected programmatically from within the application. For example:
```
TOP.EXE -URTS_DEBUG=quit -port=15000 -remotePort=16000
TOP.EXE -URTS_DEBUG=quit -port=16000 -remotePort=15000 -injectFirstPing
```
* inject either the "ping" or "pong" event on the "PingPongServer::player" port. You can do this from another application by using the JSON API provided by [TCP server](../TcpServer/).
