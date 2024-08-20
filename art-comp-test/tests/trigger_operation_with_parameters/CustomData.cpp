#include "CustomData.h"


// Parameterized Constructor
CustomData::CustomData(const std::string& name, int age) : name(name), age(age) {}

// Getters
std::string CustomData::getName() const {
    return name;
}

int CustomData::getAge() const {
    return age;
}

// Setters
void CustomData::setName(const std::string& name) {
    this->name = name;
}

void CustomData::setAge(int age) {
    this->age = age;
}

