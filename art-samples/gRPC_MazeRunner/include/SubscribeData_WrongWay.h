#ifndef _SUBSCRIBEDATA_WRONGWAY_H
#define _SUBSCRIBEDATA_WRONGWAY_H

#include <SubscribeData.h>
#include <ICommands_ProtocolServer.h>
#include "maze.grpc.pb.h"

using grpc::ServerAsyncWriter;
using google::protobuf::Empty;
using maze::WrongWay;

class SubscribeData_WrongWay : public SubscribeData {
    ICommands_ProtocolServer& grpcServer;
    Empty empty_;
    ServerAsyncWriter<WrongWay> responseWriter_;
    WrongWay wrongWay_;
public:
    SubscribeData_WrongWay( ICommands_ProtocolServer& server, ServerCompletionQueue* cq );
    void startRequest();
    void newCallData();
    void completeRequest();
    void notifySubscriber( const RTString* str );
    void unsubscribe() override;
};

#endif // _SUBSCRIBEDATA_WRONGWAY_H 