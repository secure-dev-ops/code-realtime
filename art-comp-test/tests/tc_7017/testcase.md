---
group: validation
steps: generate
ac_output match1: WARNING[7017]|top.tcjs|8:1|itself|prerequisite
ac_output match1a: top.tcjs|9:6|has lib.tcjs as a prerequisite
ac_output match1b: lib.tcjs|6:6|has lib02.tcjs as a prerequisite
ac_output match1c: lib02.tcjs|5:6|has top.tcjs as a prerequisite

ac_output match2: WARNING[7017]|lib.tcjs|5:1|itself|prerequisite
ac_output match2a: lib.tcjs|6:6|has lib02.tcjs as a prerequisite
ac_output match2b: lib02.tcjs|5:6|has top.tcjs as a prerequisite
ac_output match2c: top.tcjs|9:6|has lib.tcjs as a prerequisite

ac_output match3: WARNING[7017]|lib02.tcjs|4:1|itself|prerequisite
ac_output match3a: lib02.tcjs|5:6|has top.tcjs as a prerequisite
ac_output match3b: top.tcjs|9:6|has lib.tcjs as a prerequisite
ac_output match3c: lib.tcjs|6:6|has lib02.tcjs as a prerequisite
---
Test validation rule `TC_7017_prerequisitesCyclic`.
