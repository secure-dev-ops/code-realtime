#include <stdlib.h>
#include <fstream>
#include "testLib.h"

void TestUtils::fail(const std::string& msg) {
	std::cerr << "TEST FAILED (" << msg << ")" << std::endl << std::flush;
	exit(1);
}

void TestUtils::pass() {
	std::cout << "***PASS***" << std::endl << std::flush;
	//exit(0);
}

void TestUtils::assert_(bool cond, const char* expr, const char * file, int line, const char* msg) {
	if (cond) {
		std::string okMessage = "OK:  " + std::string(expr) + "\n";
		std::cout << okMessage;
		return;
	}

	std::cerr << "ASSERTION FAILED (" << msg << ")" << std::endl << std::flush;
}

bool TestUtils::readFileContents(const std::string& path, std::vector<std::string>& contents) {

	std::ifstream f(path.c_str());

    if (!f || !f.good())
		return false;

	std::string line;
	while (getline(f, line)) {
		contents.push_back(line);
	}

	return true;
}