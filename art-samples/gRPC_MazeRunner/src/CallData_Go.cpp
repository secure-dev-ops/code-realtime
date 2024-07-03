#include "CallData_Go.h"

using grpc::Status;

CallData_Go::CallData_Go( ICommands_ProtocolServer& server, ServerCompletionQueue* cq, Direction dir )
    : CallData(cq), grpcServer(server), empty_responder_(&ctx_), direction(dir) {
    proceed();
}

void CallData_Go::startRequest() {
	if (direction == East)
		grpcServer.getService().RequestGoEast(&ctx_, &empty_, &empty_responder_, cq_, cq_, this);
	else if (direction == West)
		grpcServer.getService().RequestGoWest(&ctx_, &empty_, &empty_responder_, cq_, cq_, this);
	else if (direction == North)
		grpcServer.getService().RequestGoNorth(&ctx_, &empty_, &empty_responder_, cq_, cq_, this);
	else if (direction == South)
		grpcServer.getService().RequestGoSouth(&ctx_, &empty_, &empty_responder_, cq_, cq_, this);
}

void CallData_Go::newCallData() {
    new CallData_Go(grpcServer, cq_, direction);
}

void CallData_Go::completeRequest() {
    // The actual processing. (Asynch event send)
    if (direction == East)
        grpcServer.goEast();
    else if (direction == West)
        grpcServer.goWest();
    else if (direction == North)
        grpcServer.goNorth();
    else if (direction == South)
        grpcServer.goSouth();

    // And we are done! Let the gRPC runtime know we've finished, using the
    // memory address of this instance as the uniquely identifying tag for
    // the event.
    empty_responder_.Finish(empty_, Status::OK, this);
}