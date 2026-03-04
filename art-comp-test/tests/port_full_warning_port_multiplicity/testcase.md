---
group: custom_rt_services_library
---
Generate a run-time warning if multiple SAPs attempt to connect to an SPP using an unwired port, such that the configured size limit is exceeded (i.e., when the number of connections surpasses the port’s capacity).
By default, the PORTFULL_WARNING macro is set to 0 in the RTConfig.h file within TargetRTS. To enable the warning, set the macro to 1 and recompile TargetRTS before running the test case.

Upon execution, the following runtime warning will be displayed:
WARNING: SAP cap[0]:Cap.sap cannot connect to SPP application[0]:Top.spp with size 1 at this time (no free port index on SPP).