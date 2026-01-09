# Tracing
This sample shows how the tracing feature can be used for capturing traces from a running application.
The sample is an extended version of a classic ping-pong ball game between two players, but specifically crafted to showcase various tracing capabilities.

* The top capsule incarnates two Players into their own threads.
* Both players make synchronous calls (invoke with implicit reply) when they get the "ball" message to increase the ball count (stored in BallCounter).
* At the end of each round (10 balls played) player1 makes a synchronous call to ballCounter to obtain the accumulated ball count (invoke with explicit reply).
* A [trace configuration file](trace-config.json) is provided and will be used by the top capsule to configure tracing programmatically. You can override this by means of the `-traceConfig` command-line option to use a different trace configuration file (for example [another-trace.config.json](another-trace.config.json)), or simply just directly change [trace-config.json](trace-config.json).
* Tracing is turned on programmatically by the top capsule just before it sends the "start" message to player1, which happens after a 1 second timeout.
* After 10 balls played by each player tracing is turned off programmatically.
* After 10 more balls played, tracing is again turned on.
* After a final 10 more balls played, the application schedules itself for termination by means of two types of messages to self (`sendCopyToMe()` versus sending to a port that is connected to another port on the same capsule). These appear differently in the trace (only the latter is considered a true self-message).
* A custom note is written to the trace at this point.
* When the application terminates it automatically flushes the trace file into the target folder. If you programmatically want to flush the trace file before that you can call `RTTracer::flush()`. As configured in the [trace configuration file](trace-config.json) the file name will include both a human readable timestamp, as well as the number of microseconds since the Unix epoch. You may adjust the `name` property to give a different name to the trace file.

Use the context menu command **Open Sequence Diagram** to view the trace in the sequence diagram viewer.

