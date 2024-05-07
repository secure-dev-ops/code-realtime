#include "numbers.h"
#include <cmath>

bool is_simple(int n) {
    for (int x = 2; x <= sqrt(n); x++) {
        if (n % x == 0) {
            return false;
        }
    }
    return true;
}
