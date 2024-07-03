#ifndef _CALLDATA_ADJUSTSTEPCOUNT_H
#define _CALLDATA_ADJUSTSTEPCOUNT_H

#include <CallData.h>
#include <ICommands_ProtocolServer.h>
#include "maze.grpc.pb.h"

using google::protobuf::Empty;
using grpc::ServerAsyncResponseWriter;
using maze::AdjustStepCountRequest;

class CallData_AdjustStepCount : public CallData {
private:
    ICommands_ProtocolServer& grpcServer;
    AdjustStepCountRequest adjustStepCountRequest_;
    ServerAsyncResponseWriter<Empty> empty_responder_;
    Empty empty_;
public:
    CallData_AdjustStepCount( ICommands_ProtocolServer& server, ServerCompletionQueue* cq );
    void startRequest();
    void newCallData();
    void completeRequest();
};

#endif // _CALLDATA_ADJUSTSTEPCOUNT_H