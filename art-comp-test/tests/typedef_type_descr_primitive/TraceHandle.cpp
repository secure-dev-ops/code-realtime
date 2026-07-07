#include <TraceHandle.h>
#include <RTStructures.h>

void rtg_TraceHandle_init(const RTObject_class *type, TraceHandle *target)
{
    RTType_unsigned._init_func(type, target);
}

void rtg_TraceHandle_copy(const RTObject_class *type, TraceHandle *target, const TraceHandle *source)
{
    RTType_unsigned._copy_func(type, target, source);
}

void rtg_TraceHandle_destroy(const RTObject_class *type, TraceHandle *target)
{
    RTType_unsigned._destroy_func(type, target);
}

int rtg_TraceHandle_encode(const RTObject_class *type, const TraceHandle *source, RTEncoding *coding)
{
    return RTType_unsigned._encode_func(&RTType_unsigned, source, coding);
}

int rtg_TraceHandle_decode(const RTObject_class *type, TraceHandle *target, RTDecoding *coding)
{
    return RTType_unsigned._decode_func(&RTType_unsigned, target, coding);
}
