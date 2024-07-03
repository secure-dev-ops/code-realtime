#include "SubscribeData_WrongWay.h"

using grpc::Status;

SubscribeData_WrongWay::SubscribeData_WrongWay( ICommands_ProtocolServer& server, ServerCompletionQueue* cq )
    : SubscribeData(cq), grpcServer(server), responseWriter_(&ctx_) {
    proceed();
}

void SubscribeData_WrongWay::startRequest() {
    grpcServer.getService().RequestSubscribe_WrongWay(&ctx_, &empty_, &responseWriter_, cq_, cq_, this);
}

void SubscribeData_WrongWay::newCallData() {
    new SubscribeData_WrongWay(grpcServer, cq_);
}

void SubscribeData_WrongWay::completeRequest() {
    // The actual processing.
    grpcServer.subscribeWrongWay(this);

    // Don't finish the request now. Instead keep it active so the server can write to the reply stream
    // whenever the WrongWay event is received.
    // The request will be finished when the client unsubscribes for receiving the WrongWay event, and
    // then finishRequest() will be called.
}

void SubscribeData_WrongWay::notifySubscriber( const RTString* str ) {
    wrongWay_.set_message(str->Contents);

    responseWriter_.Write(wrongWay_, this);
}

void SubscribeData_WrongWay::unsubscribe() {
    // Finish the subscription RPC
	responseWriter_.Finish(Status::OK, this);

    // Do not delete this CallData instance here since it's still needed for finalizing the request.
    // Don't delete it until the client again subscribes for WrongWay (because by then we know for sure
    // it's not needed anymore).
}

