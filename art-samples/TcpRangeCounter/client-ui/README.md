# TcpRangeCounter Client

This TcpRangeCounter_Client works with the TcpRangeCounter sample by sending the following events to the TcpRangeCounter sample. 
- setMin: Sets the min value of the range (default 0).
- setMax: Sets the max value of the range (default 10).
- setDelta: Sets the delta by which the counter increments in each step (default 1; Use a negative value to count down instead of up).
- resumeCounting: Resume the counter when it has stopped.

The instructions to run this TcpRangeCounter_Client are as follows:
- Build and start the TcpRangeCounter sample by following the directions in its README file.
- Start this client sample by entering 'npm install' and then 'npm start' in a terminal session. The TcpRangeCounter_Client listens on port 3000.
- Invoke the TcpRangeCounter_Client in a web browser at http://localhost:3000/.
    - Select the Event type and enter its Argument to send the event to the TcpRangeCounter sample.
    - Enter the Hostname or IP address that the TcpRangeCounter sample is running on.
    - Enter the Port that the TcpRangeCounter sample is listening on.
    - Click the Submit button.

