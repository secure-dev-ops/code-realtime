# TcpRangeCounter

This sample implements a counter that starts at a min value and increments until it reaches a max value. The application embeds a [TCP server](../TcpServer/) which allows it to be dynamically configured by means of sending TCP requests. These requests corresponds to the events of the [Events](Events.art) protocol:

- **setMin** Sets the min value of the range (default 0)
- **setMax** Sets the max value of the range (default 10)
- **setDelta** Sets the delta by which the counter increments in each step (default 1). Use a negative value to count down instead of up.
- **resumeCounting** Resume the counter when it has stopped

Build the application and start it with the command-line argument `-port=<port>` to specify a TCP port where the requests can be sent. For example:

```
Top.EXE -URTS_DEBUG=quit -port=12345
```

Any client capable of sending TCP requests can be used, and the sample includes a Node.JS application which uses the [rt-test-probe](https://github.com/HCL-TECH-SOFTWARE/rt-test-probe) utility for making the TCP requests. To use this client:

1. `npm install`
2. `node client.js`

```
Usage: node client.js <arg>
where <arg> is one of:
   -max <int> : Set max of range
   -min <int> : Set min of range
   -delta <int> : Set delta (positive to count up, negative to count down)
   -resume : Resume counting
```

Alternatively, the sample includes a web application which also uses the [rt-test-probe] utility for making TCP requests. The link to the README for using this web application is [TcpRangeCounter_Client README](client-ui\README.md).