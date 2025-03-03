---
group: cpp_code_generation
allow_stderr_printouts: true
stderr_comparison: contains
stdout_comparison: contains
---
Starting with TargetRTS version 8010 it's possible to log messages and data either to stdout or stderr by means of log streams and the insertion operator (`<<`), in a way similar to how C++ output streams work. Such logs can be made thread-safe by explicitly locking/unlocking critical sections of the log message.