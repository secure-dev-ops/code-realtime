---
group: cpp_code_generation
allow_stderr_printouts: true
---
This example illustrates the rules how triggers are matched when a capsule with a hierarchical state machine receives an event on a port. The active state is S::N1::N2.
1. **outEvent1 is received with data 0** This matches the trigger for transition N2::t1 since its transition guard condition `*rtdata == 0` is true.
2. **outEvent1 is received with data -1** This matches the first trigger for transition N2::t2 since its trigger guard condition `*rtdata < 0` is true.
3. **outEvent1 is received with data 1** No enabled trigger is found in S::N1::N2. The search therefore proceeds at S::N1 where the trigger for transition N1::t1 is matching since it has no guard (which is the same as a guard condition that is true).
4. **outEvent2 is received with data 100** This matches the second trigger for transition N2::t2 since it has no guard (which is the same as a guard condition that is true).
5. **outEvent3 is received** This doesn't match any trigger in S::N1::N2 and also not in S::N1. The search therefore proceeds to S where there is a "receive-any" trigger which matches any kind of event received on the port.
6. **unhandled** No trigger is available that matches this event and port p2 at any level in the active state configuration. This will therefore trigger a call of `unexpectedMessage()`.
