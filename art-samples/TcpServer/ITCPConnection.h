#include <string>

// Interface describing an active TCP Connection (in particular how to reply to it)
class ITCPConnection {
public:

    // Status of a request (used as value for JSON key "status" below)
    enum Status {
        OK, Error
    };

    // Reply with a string
    virtual void reply( const std::string& msg ) = 0;

    // Reply with a JSON string that has keys "status", "msg" and "result"
    virtual void replyStatus( Status status, const std::string& msg, const std::string& result ) = 0;

    // Reply with a JSON string that has keys "status" and "msg"
    virtual void replyStatus( Status status, const std::string& msg ) = 0;

    // Reply with an HTTP response that contains the specified message
    virtual void replyHTTPStatus( Status status, const std::string& msg ) = 0;
};