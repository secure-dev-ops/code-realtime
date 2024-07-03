#ifndef _CALLDATA_GO_H
#define _CALLDATA_GO_H

#include <CallData.h>
#include <ICommands_ProtocolServer.h>
#include "maze.grpc.pb.h"

using google::protobuf::Empty;
using grpc::ServerAsyncResponseWriter;

class CallData_Go : public CallData {
public:
    enum Direction {
        East, West, North, South
    };

private:
    ICommands_ProtocolServer& grpcServer;
    Empty empty_;
    ServerAsyncResponseWriter<Empty> empty_responder_;
    Direction direction;
public:
    CallData_Go( ICommands_ProtocolServer& server, ServerCompletionQueue* cq, Direction dir );
    void startRequest();
    void newCallData();
    void completeRequest();
};

#endif // _CALLDATA_GO_H