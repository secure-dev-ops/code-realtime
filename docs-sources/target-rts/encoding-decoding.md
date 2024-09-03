Encoding is the process of serializing data from memory into a string representation. Decoding is the opposite, i.e. deserializing a string representation of data into memory. There are many situations when it's useful to encode and/or decode:

* During run-time logging and tracing it can be useful to print a compact representation of data by encoding it into a string.
* If your application is distributed into several binaries that run in separate processes (or even on separate machines), and you need to send data from one binary to another, then a string representation of the data to send can be useful. The sender can encode the data into a string which for example can be sent over TCP to the receiver. The receiver can then decode the string back into data in its memory space.
* Even within the same process it can sometimes be useful to clone an object by first encoding it to a string, and then decoding that string back into a copy of the original object. However, in most cases use of copy constructors is a more efficient way of cloning objects.
* If you need to save data from your application into some form of persistent storage (file, database etc.) you can encode it into a string representation, and then persist that string. Later (possibly in another instance of your application) you can load the saved data by decoding the persisted string back to memory.

The TargetRTS provides support for encoding and decoding data by means of the `encode` and `decode` functions of a [type descriptor](../art-lang/cpp-extensions.md#type-descriptor). This means that if you want to use encoding and/or decoding for a data type, you just need to make sure that it has a type descriptor with one or both of these functions implemented. The TargetRTS has a default implementation for encoding and decoding many types, including all predefined C++ types, structured types and enums. You can choose between three string formats:

* **ASCII** This is a format that is intended to be readable both by humans and machines, while still being as compact as possible. It's however a proprietary format that is not understood by other tools.
* **ASCIIV** This format is identical to **ASCII** but in addition it includes the [version of the type descriptor](../art-lang/cpp-extensions.md#versioning). This can be useful if you change the type that gets encoded and need to maintain backwards compatibility. The decoder can then use the version information to know how to decode the encoded string.
* **JSON** This is a standardized format that is supported by a large number of tools. There are JSON parsers for most programming languages which makes it a good choice if your application includes components written in other languages than C++. Because of this, it's also a popular format for Internet-of-Things (IoT) applications that need to interact with web services or APIs.

If your data type is too complex for the default encode/decode implementation in the TargetRTS, or if you want to use some other format than the above two, you can write your own encode/decode functions. If you let your implementation inherit from the `RTEncoding` and `RTDecoding` interface classes, then the TargetRTS can seamlessly manage encoding and decoding also for your custom implementation.

If you don't need support for encoding and/or decoding in your application you should unset the macros [`OBJECT_ENCODE` and/or `OBJECT_DECODE`](build.md#object_decode-and-object_encode) both when building the TargetRTS and your application. This will reduce the application footprint.

## Encode and Decode APIs
Assume you have a data object stored in a variable `data` of type `T`, and the type descriptor of `T` has support for encoding and decoding. The sample below will encode the object to ASCII and print it to stdout. 

```cpp
T data = new T(); // Object to encode

char buf[1000];
RTMemoryOutBuffer buffer( buf, 1000 );
RTAsciiEncoding coding( &buffer );
RTType_T._encode_func(&RTType_T, &data, &coding);
buffer.write("", 1); // IMPORTANT: Terminate the buffer string before printing it!
std::cout << "ASCII encoding: " << buf << std::endl << std::flush;  
```

Here we call the static encode function of the type descriptor (`_encode_func`) and provide the type descriptor object (`RTType_T`), the object to encode (`data`) and the ASCII coding object (`coding`). If you instead prefer to use the JSON encoding, just change the type of the coding object from `RTAsciiEncoding` to `RTJsonEncoding` (see the example below).

To avoid the risk of overflowing a fixed-sized buffer, and get a slightly more compact code, you can use the [`RTDynamicStringOutBuffer`](../targetrts-api/class_r_t_dynamic_string_out_buffer.html) utility class. You can encode by calling `put()` on the coding object:

```cpp
RTDynamicStringOutBuffer buffer;
RTJsonEncoding coding(&buffer);
coding.put(&data, &RTType_T);
std::cout << "JSON encoding: " << buffer.getString() << std::endl << std::flush;  
```

`RTEncoding::put()` produces a string that is prefixed with the type name. For JSON encoding it may look like this: 

```json
{T}{"a" : 5,"b" : true}
```

The `{T}` prefix is needed if you later want to decode this string back to an object, but it has to be stripped off to get a string with valid JSON syntax. If you only are interested in getting the JSON encoding, without the type prefix, you can instead call `RTEncoding::put_struct()` (assuming `T` is a structured type).

Let's continue the above example and decode the string stored in `buffer` back to an object of type `T`:

```cpp
RTMemoryInBuffer inBuffer(buffer.getString(), RTMemoryUtil::strlen(buffer.getString()));
RTJsonDecoding decoding(&inBuffer);
void* decodedObj;
const RTObject_class* type;
decoding.get(&decodedObj, &type);
T* decodedData = reinterpret_cast<T*>(decodedObj);
```

Here we call `RTJsonDecoding::get()` to perform the decoding. This function expects a string that is prefixed with the type name, and it will look-up the type descriptor object based on it (`type` in the example). The decoded object is assigned to `decodedObj` which is untyped (`void*`). You can cast this pointer to the expected type (`T`).

If your JSON string is not prefixed with the type name, you can instead call `RTJsonDecoding::get_struct` which takes the type descriptor object as an argument.

```cpp
decoding.get_struct(&decodedObj, &RTType_T);
T* decodedData = reinterpret_cast<T*>(decodedObj);
```

Note that decoding will allocate and initialize a new object in memory. It's your responsibility to delete this object when you no longer need it. If you prefer to work with the decoded object as an untyped pointer, you can delete the object by calling the destroy function on the type descriptor like this:

```cpp
type->destroy(decodedObj, RTObject_class::DestroyAndDeallocate);
```

### Encoding a Message
The JSON encoder has a special function `put_msg` which can be used for encoding a received [`RTMessage`](../targetrts-api/class_r_t_message.html) to JSON. It can for example be useful as a way to trace received messages in a standard format which other tools can read and use. Here is an example of how it can be used in a code snippet within a capsule (e.g. a transition):

```cpp
RTDynamicStringOutBuffer buf;
RTJsonEncoding coding(&buf);
coding.put_msg(msg);
cout << "Received msg: " << buf.getString() << endl << flush;
```

The encoding includes the name of the message's event, its argument data type (if any) and the data object itself (if any). Here is an example of what it may look like:

```json
{
    "event" : "event_with_class",
    "type" : "MyClass",
    "data" : {"a" : 8, "b" : false}
}
```

## Default Encoding/Decoding Rules
The default encoding/decoding in the TargetRTS follows these rules:

1. Structured types are encoded as a comma-separated list of name-value pairs enclosed in curly brackets. The name of each member variable (field) is followed by its value. Member variables are encoded in the same order as they are declared in the structured type.
2. Inherited member variables are encoded before local ones. Only single inheritance is supported. If your data type uses multiple inheritance you have to provide a [custom implementation](#custom-encodingdecoding) for encoding/decoding it.
3. An enum literal is encoded using an integer that corresponds to its order of declaration in the enum (0 for the first literal). Note that this is not always the same as the literal's integer value in C++.
4. Primitive C++ types, such as int, bool and float, are encoded with the string representation of its value. Note that float values are always encoded with maximum precision, which may lead to more decimals than wanted. After decoding you can round it to the desired precision.
5. For some primitive C++ types, such as char, there is no directly corresponsing JSON type. In those cases a string value is used in the JSON encoding.
6. Some types provided by the TargetRTS, such as RTString and RTByteBlock, has a type descriptor that supports encoding/decoding. But not all of these types are supported by the JSON encoding/decoding.
7. Attributes of pointer type can be encoded (as a hexadecimal number), but naturally you should only decode objects containing pointers in the same memory space where they are valid.

If you wish to change any of these rules, you can [customize encoding/decoding](#custom-encodingdecoding).

## Custom Encoding/Decoding
If you want to customize how a certain type gets encoded/decoded, you can write a custom encode and/or decode function for its type descriptor. Note that you can also define a typedef or type alias of an existing type, if you only want to change the encoding/decoding for some objects typed by that type (i.e. then change the type of those objects to your typedef or type alias instead). See [this chapter](../art-lang/cpp-extensions.md#automatically-generated) for more information and examples.

If you want to encode/decode using a different format, such as another textual format or even a binary format, you need to write your own encoder and/or decoder. If possible you should let your implementation inherit from the `RTEncoding` and `RTDecoding` classes. That allows the TargetRTS to work seamlessly with your implementation from encode/decode functions of a type descriptor. 

You can also let your encoder and/or decoder class inherit from the classes that implement ASCII and JSON encoding/decoding by overriding some of their virtual functions. This can be useful if you just want to slightly customize the ASCII or JSON encoding/decoding. For example, assume you want to change the JSON encoding to encode boolean data as strings. Then you can define your custom encoder class like below:

```cpp
#include <RTJsonEncoding.h>

class CustomJsonEncoding : public RTJsonEncoding {
    public:
    CustomJsonEncoding(RTOBuffer * buffer)
        : RTJsonEncoding(buffer) {}

    virtual int put_bool(bool value) {
        if (output->write("\"", 1 ) != 1)
            return 0;
        int res = RTJsonEncoding::put_bool(value);
        if (output->write("\"", 1 ) != 1)
            return 0;
        return res;
    }
};
```

## JSON Parser
The JSON Decoder has to parse a JSON string before it can create an object representation of it in memory. However, it only needs to support parsing a subset of JSON, namely the subset of JSON which can be produced by the JSON Encoder. Because of this it doesn't need to use a general-purpose JSON parser.

There are, however, scenarios where you may need to parse JSON, not for the purpose of decoding it, but for some other reason. For example, you may get JSON as the result of making an API call, and then need to parse the JSON to more easily extract the relevant information from it. To support this scenario the TargetRTS includes a general-purpose JSON parser implemented in [`RTJsonParser`](../targetrts-api/class_r_t_json_parser.html).

You parse a JSON string by calling `RTJsonParser::parseJsonString()`. The parser result is represented by an object of [`RTJsonResult`](../targetrts-api/class_r_t_json_result.html). On this object you can call functions to

* query the type of result (either a JSON object or a JSON array) (`get_type()`)
* get the value for a key of a JSON object (`operator[const std::string&]`)
* get the value at a certain index of a JSON array (`operator[size_t]`)

Values are also represented by [`RTJsonResult`](../targetrts-api/class_r_t_json_result.html) and you can check their type (either `null`, JSON object, array, string, number or boolean). For values with types that correspond to C++ primitive types you can call "get_" functions (e.g. `get_bool()` to get a C++ bool from a JSON boolean value). Do not forget to first check the type of the value, because if you try to convert to the wrong kind of value, the result may be unexpected. Often it's more convenient to use one of the `operator==` functions to directly compare a JSON value with the corresponding C++ value.

Here is an example of how to parse a JSON string and check the result:

```cpp
RTJsonParser parser;
RTJsonResult result;
bool ok = parser.parseJsonString(result, "{\"field1\" : \"string\", \"arr\" : [1,true,3.14]}");

std::cout << result["field1"].get_string() << std::endl; // "string"
if (result["arr"].ok()) { // Check if the "arr" key is present
    std::cout << result["arr"].get_size() << std::endl; // 3
    if (result["arr"][2] == 3.14) {} // will be true
    if (result["arr"][1].get_type() == RTJsonResult::RTJSON_BOOL) {} // will be true
}
```

!!! example
    You can find a sample application that uses the JSON parser [here]({$vars.github.repo$}/tree/main/art-comp-test/tests/json_parse).
