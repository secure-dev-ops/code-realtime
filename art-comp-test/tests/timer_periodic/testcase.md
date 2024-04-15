---
group: rt_services_library
---
This example shows how to use a periodic timer, i.e. a timer that times out repeatedly at certain intervals. Timer data can be passed with the timeout event, and it will be copied once (when the timer is set). The copied data will be passed with each timeout event produced by the periodic timer.