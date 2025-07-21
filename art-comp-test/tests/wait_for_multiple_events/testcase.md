---
group: rt_services_library
---
The TargetRTS provides a utility class RTMultiReceive which makes it possible to wait in a state until multiple messages have been received, and then transition to another state. When entering the source state a number of "expectations" are set up (represented by the class RTEventReception). Internal transitions of the source state trigger on the expected events, and notify the RTMultiReceive object about the received messages. The outgoing transition to the target state asks the RTMultiReceive object in its guard condition if all events have been received, so the target state can be entered.
