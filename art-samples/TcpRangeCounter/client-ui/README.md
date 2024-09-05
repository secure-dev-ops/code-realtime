# TcpRangeCounter Client

This Node.js Express sample client works with the TcpRangeCounter sample by sending events to the TcpRangeCounter sample.  The TcpRangeCounter sample implements a counter that starts at a min value and increments until it reaches a max value.  It embeds a TCP server which allows it to be dynamically configured by means of sending TCP requests.  These requests corresponds to the events of the Events protocol:

* setMin: Sets the min value of the range (default 0).

* setMax: Sets the max value of the range (default 10).

* setDelta: Sets the delta by which the counter increments in each step (default 1; Use a negative value to count down instead of up).

* resumeCounting: Resume the counter when it has stopped.

The following are instructions to run this sample client.

* Build and start the TcpRangeCounter sample by following the directions in its README file.

* Start this sample client by entering 'npm install' and then 'npm start' in a terminal session.  The client listens on port 3000.

* Invoke the sample client in a web browser at http://localhost:3000/.