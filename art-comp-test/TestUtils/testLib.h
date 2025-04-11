#ifndef TEST_LIB_H
#define TEST_LIB_H

#include <iostream>
#include <string>
#include <vector>

using std::cout;
using std::cerr;
using std::endl;

namespace TestUtils {

	// Fail the test case with a message
	void fail(const std::string& msg);

	// Pass the test case
	void pass();

	// Assert on the condition being true. If not, the message (and condition expression and location of the assert)
	// will be printed and the test case will fail.
	void assert_(bool cond, const char* expr, const char * file, int line, const char* msg = "");
	#define assert(cond, ...) assert_(cond, #cond, __FILE__, __LINE__, ##__VA_ARGS__)

	#define PASS()            TestUtils::pass();    context()->abort()
	#define FAIL(msg)         TestUtils::fail(msg);
	#define ASSERT(cond, msg) TestUtils::assert(cond, msg)

	// Determines if a file is present at the path, and if so reads its lines into the vector
	bool readFileContents(const std::string& path, std::vector<std::string>& contents);
}

#endif
