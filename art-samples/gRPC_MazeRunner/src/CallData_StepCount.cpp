#include "CallData_StepCount.h"

using grpc::Status;
using maze::StepCountReply;

CallData_StepCount::CallData_StepCount( ICommands_ProtocolServer& server, ServerCompletionQueue* cq )
    : CallData(cq), grpcServer(server), stepCountResponder_(&ctx_) {
    proceed();
}

void CallData_StepCount::startRequest() {
    grpcServer.getService().RequestStepCount(&ctx_, &empty_, &stepCountResponder_, cq_, cq_, this);
}

void CallData_StepCount::newCallData() {
    new CallData_StepCount(grpcServer, cq_);
}

void CallData_StepCount::completeRequest() {
    // The actual processing.
    unsigned int stepCount = grpcServer.getSteps(); // Sync event invoke

    // And we are done! Let the gRPC runtime know we've finished, using the
    // memory address of this instance as the uniquely identifying tag for
    // the event.
    stepCountReply_.set_count(stepCount);
    stepCountResponder_.Finish(stepCountReply_, Status::OK, this);
}

