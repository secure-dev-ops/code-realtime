---
group: validation
steps: generate
ac_output match1: WARNING[4001]|7:9|XCap|SA|bt|timeout
ac_output match1a: unconditional transition|38:9
ac_output match2: WARNING[4001]|35:9|t2|XCap|State1|t|timeout
ac_output match2a: unconditional transition|34:9|t1
ac_output match3: WARNING[4001]|36:9|XCap|State1|t|timeout
ac_output match3a: unconditional transition|34:9|t1
ac_output match3b: unconditional transition|35:9|t2
ac_output match4: WARNING[4001]|26:13|t|XCap|t|Nested|t|timeout
ac_output match4a: unconditional transition|25:13
ac_output match5: WARNING[4001]|28:13|XCap|t3|Nested|t|timeout
ac_output match5a: unconditional transition|25:13
ac_output match5b: unconditional transition|26:13|t
---
Test validation rule `CPP_4001_unreachableTransition`.
