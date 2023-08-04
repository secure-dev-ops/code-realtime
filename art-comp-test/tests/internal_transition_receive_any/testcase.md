---
group: cpp_code_generation
---
A "receive-any" event (denoted by specifying the event of a trigger using an asterisk) can trigger on any event. It is in particular useful for internal transitions on composite states as a way to handle all events that are not handled by transitions inside the composite state.