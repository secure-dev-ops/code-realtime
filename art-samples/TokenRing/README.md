# TokenRing
This distributed application takes inspiration from an [old network protocol](https://en.wikipedia.org/wiki/Token_Ring) with the same name. Two or more instances of the application are connected in a ring structure, so a token can be passed from one application to the next one. The applications communicate by means of the [TCPServer library](../TcpServer/README.md).

## Usage
Start two or more instances of the application and use the `-port` and `-remotePort` to connect them in a ring. For example, to create a ring of three connected applications you can launch them like this:

`
.\Top.EXE -port=12301 -remotePort=12302 -URTS_DEBUG=quit
`
`
.\Top.EXE -port=12302 -remotePort=12303 -URTS_DEBUG=quit
`
`
.\Top.EXE -port=12303 -remotePort=12301 -URTS_DEBUG=quit
`

The application reads commands from the terminal:

* **token** Inject a token in the application. It will be passed to the next application in the ring, and continue to circle as long as the ring remains connected.

* **exit** Exit the application. This will remove it from the ring.

Note that you can inject multiple tokens in the ring, and they will circulate independently of each other.