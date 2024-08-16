This version of Dining Philosophers uses 

- optional capsule parts with wired ports
- capsule initialization data passed to the initial transition of its state machine
- use of command-line arguments for passing configuration data
- use of TargetRTS function `RTMessage::sap()` to determine the port where the triggering message was received.

The application accepts one of the following command-line arguments for configuring the application behavior:

1. `l` Use pick-up strategy "LeftFirst"
2. `ra` Use pick-up strategy "Random"
3. `ri` Use pick-up strategy "RightFirst"

Note that the parsing of the command-line is simplistic and requires that the argument comes first on the command-line (before other arguments such as `-URTS_DEBUG=quit`).

Credit to [Queen's University](https://research.cs.queensu.ca/home/dingel/cisc844_F23/sampleModels/sampleModels.html) for the implementation.