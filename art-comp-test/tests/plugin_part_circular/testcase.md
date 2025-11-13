---
group: rt_services_library
allow_stderr_printouts: true
---
Importing a capsule instance into a plugin part can cause circular composite structures (i.e. where one capsule instance contains itself directly or indirectly). The TargetRTS checks for this error condition and will fail the import with an error message if it happens.
