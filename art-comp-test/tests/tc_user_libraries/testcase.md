---
group: tc
compiler: GNU
---
Test tc.userLibraries property. It contains relative path to libUser.a which implements a UserFunction.
libUser.a is precompiled with the following commands and committed to git.<br>
g++ -c UserLibrary.cpp<br>
ar -rc libUser.a UserLibrary.o<br>
UserFunction is called from generated application, so both compile and link commands must be correct.
