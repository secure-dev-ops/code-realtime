---
group: validation
steps: generate
env: TARGET_RTS_DIR=non-existing
ac_output match1: ERROR[7006]|top.tcjs|targetRTSLocation|non-existing
ac_output match2: ERROR[7007]|top.tcjs|target configuration|non-existing
---
Test validation rules `TC_7006_invalidTargetRTSLocation` and `TC_7007_invalidTargetConfig`.
Note: The test framework uses a build variant script which will set the TargetRTS location and target configuration so we cannot set these in the TC file. Instead we can override the Target RTS location using the `TARGET_RTS_DIR` environment variable to a non-existing folder, and that will then automatically also trigger `TC_7007` since the target configuration set by the build variant script doesn't exist there.