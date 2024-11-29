# Matrix Multiplication 

Art implementation of Cannon's algorithm for 2D meshes. Uses optional capsules and dynamically wired (unwired) ports to create a suitably connected processor grid at runtime.
Other Art features used are choice points, operations, data classes, port and capsule replication, and defer/recall. To allow for more of the algorithm steps to become visible on the level of the state machines, it also uses tick messages that a capsule sends to itself to trigger the next transition.

Credit to [Queen's University](https://research.cs.queensu.ca/home/dingel/cisc844_F23/sampleModels/sampleModels.html) for the implementation.

## Usage
`./Top.EXE -URTS_DEBUG=quit -UARGS 2 2 "[2,2,2,2]" "[3,3,3,3]"`

`./Top.EXE -URTS_DEBUG=quit -UARGS 2 3 "[2,2,2,4,4,4]" "[5,5,5,5,5,5]"`

`./Top.EXE -URTS_DEBUG=quit -UARGS 3 3 "[2,2,2,2,2,2,2,2,2]" "[3,3,3,3,3,3,3,3,3]"`

