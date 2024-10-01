---
group: cpp_code_generation
---
This test ensures that the count and sequence of rtg_interfaces align with the defined order of the respective part ports. Additionally, it verifies that any unconnected ports are properly represented with an entry as (nullptr, 0). If an unconnected port is not listed or replaced with nullptr, a runtime exception "Insufficient interface replication" will occur.

In this example, kPort is defined in the Capsule A but is not connected to any other port. The position of kPort in the RTInterfaceDescriptor array is represented by nullptr for the name and 0 for the multiplicity.