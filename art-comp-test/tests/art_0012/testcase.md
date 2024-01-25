---
group: validation
steps: generate
ac_output match1: ERROR[0012]|1:3|rt::header_preface|.art file
ac_output match2: ERROR[0012]|6:7|rt::create|capsule
ac_output match3: ERROR[0012]|20:7|rt::unknown|capsule
ac_output match4: ERROR[0012]|30:7|rt::create|part
ac_output match5: ERROR[0012]|40:7|rt::destroy|part
---
Test validation rule `ART_0012_invalidCodeSnippet`.
