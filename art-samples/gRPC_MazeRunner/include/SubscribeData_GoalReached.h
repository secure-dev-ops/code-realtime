#ifndef _SUBSCRIBEDATA_GOALREACHED_H
#define _SUBSCRIBEDATA_GOALREACHED_H

#include <SubscribeData.h>
#include <ICommands_ProtocolServer.h>
#include "maze.grpc.pb.h"

using grpc::ServerAsyncWriter;
using google::protobuf::Empty;
using maze::StepCountReply;

class SubscribeData_GoalReached : public SubscribeData {
    ICommands_ProtocolServer& grpcServer;
    Empty empty_;
    ServerAsyncWriter<StepCountReply> responseWriter_;
    StepCountReply stepCountReply_;
public:
    SubscribeData_GoalReached( ICommands_ProtocolServer& server, ServerCompletionQueue* cq );
    void startRequest();
    void newCallData();
    void completeRequest();
    void notifySubscriber( const unsigned int stepCount);
    void unsubscribe() override;
};

#endif // _SUBSCRIBEDATA_GOALREACHED_H