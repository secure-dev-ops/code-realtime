#ifndef _ICOMMANDS_PROTOCOLSERVER_H
#define _ICOMMANDS_PROTOCOLSERVER_H

#include "maze.grpc.pb.h"

using maze::MazeWalker;
class SubscribeData_GoalReached;
class SubscribeData_WrongWay;

class ICommands_ProtocolServer
{
public:    
    virtual void goEast() = 0;
    virtual MazeWalker::AsyncService& getService() = 0;
    virtual unsigned int getSteps() = 0;
    virtual void goSouth() = 0;
    virtual void goNorth() = 0;
    virtual void goWest() = 0;
    virtual void adjustStepCount( int adjustment ) = 0;
    virtual void subscribeWrongWay( SubscribeData_WrongWay* data ) = 0;
    virtual void unsubscribeWrongWay() = 0;
    virtual void subscribeGoalReached( SubscribeData_GoalReached* data ) = 0;
};

#endif // _ICOMMANDS_PROTOCOLSERVER_H