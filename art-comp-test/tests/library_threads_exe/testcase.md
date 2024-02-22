---
group: cpp_code_generation
---
A library TC can declare logical threads which code in the library can use when incarnating capsules. An executable TC which has such a library TC as a prerequisite can then map those logical threads to physical threads created in the application. Here a library capsule incarnates two capsule instances into an optional part, and sets them to be run by different logical threads. An executable which links with the library maps these logical threads to the same physical thread.