#ifndef _CALLDATA_STEPCOUNT_H
#define _CALLDATA_STEPCOUNT_H

#include <CallData.h>
#include <ICommands_ProtocolServer.h>
#include "maze.grpc.pb.h"

using google::protobuf::Empty;
using grpc::ServerAsyncResponseWriter;
using maze::StepCountReply;

class CallData_StepCount : public CallData {
private:
    StepCountReply stepCountReply_;
    ServerAsyncResponseWriter<StepCountReply> stepCountResponder_;
    ICommands_ProtocolServer& grpcServer;
    Empty empty_;
public:
    CallData_StepCount( ICommands_ProtocolServer& server, ServerCompletionQueue* cq );
    void startRequest();
    void newCallData();
    void completeRequest();
};

#endif // _CALLDATA_STEPCOUNT_H