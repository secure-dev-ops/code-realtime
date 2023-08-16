---
group: cpp_code_generation
---
Just like a class, a capsule may have custom constructors with arguments for passing initialization data to the capsule. Here such a capsule is typing a fixed capsule part. In this case we need to write a create function for the part which calls the constructor with the right arguments.