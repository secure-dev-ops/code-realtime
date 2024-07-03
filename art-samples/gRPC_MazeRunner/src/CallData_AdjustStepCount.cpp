#include "CallData_AdjustStepCount.h"

using grpc::Status;

CallData_AdjustStepCount::CallData_AdjustStepCount( ICommands_ProtocolServer& server, ServerCompletionQueue* cq )
    : CallData(cq), grpcServer(server), empty_responder_(&ctx_) {
    proceed();
}

void CallData_AdjustStepCount::startRequest() {
    grpcServer.getService().RequestAdjustStepCount(&ctx_, &adjustStepCountRequest_, &empty_responder_, cq_, cq_, this);
}

void CallData_AdjustStepCount::newCallData() {
    new CallData_AdjustStepCount(grpcServer, cq_);
}

void CallData_AdjustStepCount::completeRequest() {
    // The actual processing.
    int32_t adjustment = adjustStepCountRequest_.adjustment();
    grpcServer.adjustStepCount(adjustment);

    // And we are done! Let the gRPC runtime know we've finished, using the
    // memory address of this instance as the uniquely identifying tag for
    // the event.
    empty_responder_.Finish(empty_, Status::OK, this);
}

