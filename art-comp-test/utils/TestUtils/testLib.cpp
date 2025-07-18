#include <stdlib.h>
#include <fstream>
#include "testLib.h"
#include "RTStructures.h"
#include "RTDynamicStringOutBuffer.h"

void TestUtils::fail(const std::string& msg) {
	std::cerr << "TEST FAILED (" << msg << ")" << std::endl << std::flush;
	exit(1);
}

void TestUtils::pass() {
	std::cout << "***PASS***" << std::endl << std::flush;
	//exit(0);
}

void TestUtils::assert_(bool cond, const char* expr, const char* file, int line, const char* msg) {
	if (cond) {
		std::cout << "OK:  " << expr << std::endl;
		return;
	}
	std::cerr << "ASSERTION FAILED:  " << expr << std::endl;
	std::cerr << file << ":" << line << ": " << msg << std::endl;
	fail("assertion failure");
}

bool TestUtils::readFileContents(const std::string& path, std::vector<std::string>& contents)
{
	std::ifstream f(path.c_str());

	if (!f || !f.good())
		return false;

	std::string line;
	while (getline(f, line)) {
		contents.push_back(line);
	}

	return true;
}

std::string TestUtils::getASCIIEncodedString(const void* data, const RTObject_class* type)
{
	ASSERT(data != nullptr, "No data to encode");
	ASSERT(type != nullptr, "No type descriptor");
	RTDynamicStringOutBuffer buffer;
	RTAsciiEncoding coding(&buffer);
	coding.put(data, type);
	std::cout << "ASCII encoding: " << buffer.getString() << std::endl;
	return buffer.getString();
}

void TestUtils::checkMessageASCII(const RTMessage* msg, const std::string& expected)
{
	const RTObject_class* expected_type = msg->getType();

	// ASCII encode message data to string
	std::string encoding1 = TestUtils::getASCIIEncodedString(msg->getData(), msg->getType());
	ASSERT(encoding1 == expected, encoding1.c_str());

	// ASCII decode from string
	ASSERT(expected_type->_decode_func != nullptr, "Decode function is not available");
	RTMemoryInBuffer buf2(encoding1.c_str(), encoding1.length());
	RTAsciiDecoding decoding(&buf2);
	void* data;
	const RTObject_class* type;
	ASSERT(decoding.get(&data, &type), "Failed to decode data");
	std::cout << "ASCII decoding: type = " << type->_name << std::endl;
	ASSERT(type == expected_type, "Unexpected type descriptor");

	// ASCII encode again and compare
	std::string encoding2 = TestUtils::getASCIIEncodedString(data, type);
	ASSERT(encoding1 == encoding2, "encode - decode - encode gives different encodings");

	// Release memory
	ASSERT(type->_destroy_func != nullptr, "Destroy function is not available");
	type->destroy(data, RTObject_class::DestroyAndDeallocate);
	std::cout << std::endl;
}
