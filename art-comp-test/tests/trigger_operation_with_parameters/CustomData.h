#ifndef CUSTOMDATA_H
#define CUSTOMDATA_H

#include <iostream>

class CustomData {
private:
    std::string name;
    int age;

public:
    // Constructor
    CustomData(const std::string& name, int age);

    // Getters
    std::string getName() const;
    int getAge() const;

    // Setters
    void setName(const std::string& name);
    void setAge(int age);
    static CustomData cdata;

};

#endif // CUSTOMDATA_H