#ifndef TEST_LIB_H
#define TEST_LIB_H

#include <iostream>
#include <string>
#include <vector>

using namespace std;
class RTMessage;
class RTObject_class;

namespace TestUtils {

	// Fail the test case with a message
	void fail(const std::string& msg);

	// Pass the test case
	void pass();

	// Assert on the condition being true. If not, the message (and condition expression and location of the assert)
	// will be printed and the test case will fail.
	void assert_(bool cond, const char* expr, const char* file, int line, const char* msg = "");
	#define assertTest(cond, msg) assert_(cond, #cond, __FILE__, __LINE__, msg)

	#define PASS()            TestUtils::pass();    context()->abort()
	#define FAIL(msg)         TestUtils::fail(msg);
	#define ASSERT(cond, msg) TestUtils::assertTest(cond, msg)

	// Determines if a file is present at the path, and if so reads its lines into the vector
	bool readFileContents(const std::string& path, std::vector<std::string>& contents);

	// Encode data with ASCII encoding and return a string with encoded data
	// If data or type is null, test case will fail with an assertion
	std::string getASCIIEncodedString(const void* data, const RTObject_class* type);

	// Checks that message data ASCII encoding is expected and can be properly decoded
	// Message must hold some data with a concrete type descriptor (not void*)
	void checkMessageASCII(const RTMessage* msg, const std::string& expected);
}

#endif
