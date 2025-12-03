#include "RTType_NonAbstract.h"

bool NonAbstract::testNonAbstractDescriptor() const {
    return RTType_NonAbstract._init_func != RTabstract_init &&
        RTType_NonAbstract._copy_func != RTabstract_copy &&
        RTType_NonAbstract._move_func != RTabstract_move;
}