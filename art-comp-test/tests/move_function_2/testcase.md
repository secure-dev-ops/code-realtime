---
group: rt_services_library
compiler: c++11
target_rts_version: 7.1.05
converted_from: rsarte-tests-mc-exe/tests/move_function_2
---

Sends events with RTString and std::string as data between two capsules using std::move. The receiving capsule also moves the received data into its own attributes. Then it sends back this data again, also using std::move. Now we expect the first capsule to receive RTString data that is pointing at the original memory location (since data always moved and never copied). We also expect the StdString move function to have been called twice.

