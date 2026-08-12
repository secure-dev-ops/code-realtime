---
group: validation
steps: generate
ac_output match1: WARNING[7020]|top.tcjs|4:1|sources|Expected .art, .cpp or .h file.
ac_output match2: WARNING[7020]|top.tcjs|4:1|sources|does not exist
ac_output match3: WARNING[7020]|top.tcjs|4:1|sources|unsupported file type
ac_output match4: WARNING[7020]|top.tcjs|4:1|sources|must include at least one Art (.art) file.
---
Test validation rule `TC_7020_invalidSourcesProperty`.

The `sources` property in [top.tcjs](top.tcjs) has an invalid value that triggers
the rule for all three reasons documented for this rule:

1. `notes.txt` has a file extension that is not allowed (only `.art`, `.cpp`
   and `.h` are permitted).
2. `missing.cpp` is a non-wildcard pattern that does not match any file in the
   workspace folder or any subfolder.
3. No Art file (`.art`) is included in the `sources` array.
