---
group: cpp_code_generation
---
This sample has a fixed capsule part typed by a capsule with an excluded port. Even if the port is excluded it should be generated into the `rtg_ports` and `rtg_relays` arrays of the capsule class. Otherwise valid connections to other ports may fail to be set-up and cause a run-time error about "non-existing interface".