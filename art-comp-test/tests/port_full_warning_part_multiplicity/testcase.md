---
group: custom_rt_services_library
---
This test case verifies that registering the SAP port twice by creating a fixed‑part capsule instance with multiplicity 2 using an unwired port triggers the port full warning.
By default, the PORTFULL_WARNING macro is set to 0 in the RTConfig.h file within TargetRTS. To enable the warning, set the macro to 1 and recompile TargetRTS before executing the test case.

Upon execution, the following runtime warning will be displayed:
WARNING: SAP cap[1]:Cap.sap cannot connect to SPP application[0]:Top.spp with size 1 at this time (no free port index on SPP).