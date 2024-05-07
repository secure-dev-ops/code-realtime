#include <filesystem>
namespace fs = std::filesystem;
#include "stringUtils.h"

bool isCPPFile(const std::string& fileName) {
    const fs::path ext = fs::path(fileName).extension();
    return ext.string() == ".cpp";
}
