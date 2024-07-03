#ifndef _CALLDATA_UNSUBSCRIBE_WRONGWAY_H
#define _CALLDATA_UNSUBSCRIBE_WRONGWAY_H

#include <CallData.h>
#include <ICommands_ProtocolServer.h>
#include "maze.grpc.pb.h"

using google::protobuf::Empty;
using grpc::ServerAsyncResponseWriter;

class CallData_Unsubscribe_WrongWay : public CallData {
private:
    ICommands_ProtocolServer& grpcServer;
    Empty empty_;
    ServerAsyncResponseWriter<Empty> empty_responder_;
public:
    CallData_Unsubscribe_WrongWay( ICommands_ProtocolServer& server, ServerCompletionQueue* cq );
    void startRequest();
    void newCallData();
    void completeRequest();
};

#endif // _CALLDATA_UNSUBSCRIBE_WRONGWAY_H