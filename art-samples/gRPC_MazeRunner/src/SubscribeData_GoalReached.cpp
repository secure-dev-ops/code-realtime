#include "SubscribeData_GoalReached.h"

using grpc::Status; 

SubscribeData_GoalReached::SubscribeData_GoalReached( ICommands_ProtocolServer& server, ServerCompletionQueue* cq )
    : SubscribeData(cq), grpcServer(server), responseWriter_(&ctx_) {
    proceed();
}

void SubscribeData_GoalReached::startRequest() {
    grpcServer.getService().RequestSubscribe_GoalReached(&ctx_, &empty_, &responseWriter_, cq_, cq_, this);
}

void SubscribeData_GoalReached::newCallData() {
    new SubscribeData_GoalReached(grpcServer, cq_);
}

void SubscribeData_GoalReached::completeRequest() {
    // The actual processing.
    grpcServer.subscribeGoalReached(this);

    // Don't finish the request now. Instead keep it active so the server can write to the reply stream
    // whenever the WrongWay event is received.
    // The request will be finished when the client unsubscribes for receiving the WrongWay event, and
    // then finishRequest() will be called.
}

void SubscribeData_GoalReached::notifySubscriber( const unsigned int stepCount ) {
    stepCountReply_.set_count(stepCount);

    responseWriter_.Write(stepCountReply_, this);
}

void SubscribeData_GoalReached::unsubscribe() {
    // Finish the subscription RPC
	responseWriter_.Finish(Status::OK, this);

    // Do not delete this CallData instance here since it's still needed for finalizing the request.
    // Don't delete it until the client again subscribes for WrongWay (because by then we know for sure
    // it's not needed anymore).
}

