#include "CallData_Unsubscribe_WrongWay.h"

using grpc::Status;

CallData_Unsubscribe_WrongWay::CallData_Unsubscribe_WrongWay( ICommands_ProtocolServer& server, ServerCompletionQueue* cq )
    : CallData(cq), grpcServer(server), empty_responder_(&ctx_) {
    proceed();
}

void CallData_Unsubscribe_WrongWay::startRequest() {
    grpcServer.getService().RequestUnsubscribe_WrongWay(&ctx_, &empty_, &empty_responder_, cq_, cq_, this);
}

void CallData_Unsubscribe_WrongWay::newCallData() {
    new CallData_Unsubscribe_WrongWay(grpcServer, cq_);
}

void CallData_Unsubscribe_WrongWay::completeRequest() {
    // The actual processing
    grpcServer.unsubscribeWrongWay();

    // And we are done! Let the gRPC runtime know we've finished, using the
    // memory address of this instance as the uniquely identifying tag for
    // the event.
    empty_responder_.Finish(empty_, Status::OK, this);
}

