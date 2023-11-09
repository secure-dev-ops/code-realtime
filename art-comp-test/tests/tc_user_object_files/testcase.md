---
group: tc
compiler: GNU
---
Test tc.userObjectFiles property. It contains relative path to UserObjectFile.o which implements an isPair function.
UserObjectFile.o is generated with this command and committed to git.<br>
g++ -c UserObjectFile.cpp<br>
isPair function is called from generated application, so both compile and link commands must be correct.
