---
group: validation
steps: generate
ac_cmd_args: --ruleConfig E0004
ac_output match1: INFO[0004]|6:19|LogPort
ac_output match2: ERROR[0004]|19:10|PART
ac_output match3: ERROR[0004]|27:13|AnOp
---
Test configuration of validation rules using local and global rule configurations.