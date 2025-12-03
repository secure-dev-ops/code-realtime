#include "RTType_Abstract.h"

bool Abstract::testAbstractDescriptor() const {
    return RTType_Abstract._init_func == RTabstract_init &&
        RTType_Abstract._copy_func == RTabstract_copy &&
        RTType_Abstract._move_func == RTabstract_move;
}