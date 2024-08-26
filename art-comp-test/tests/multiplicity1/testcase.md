---
group: cpp_code_generation
---
This sample model is contributed by Queen's University [here](https://research.cs.queensu.ca/home/dingel/cisc844_F23/sampleModels/sampleModels.html).

Test port replication.

Part `b : B` sends message `m(42)` on port `p1` which has multiplicity `3` and is connected to three `A` parts.
The message is replicated 3 times and is delivered to all `A` parts which send 3 messages back.
In part `b : B` we are checking that all 3 messages are delivered from different port `p2` indexes.
