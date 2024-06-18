#ifndef IPUSH_BUTTON_H
#define IPUSH_BUTTON_H

// Interface implemented by the push button
class IPushButton {
public:

    // Called when the push button is clicked in the UI
    virtual void onClicked() = 0;
};

#endif // IPUSH_BUTTON_H