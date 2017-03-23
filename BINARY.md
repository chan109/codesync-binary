# Binary API.
This is for all communication binary-binary.

---
### Cursor Position
This should be updated everytime the cursor position changes or every 100ms whichever happens soonest.

* **Size:** 10 bytes (may be updated soon, when we add multi-files).
* **Data Structure:** 
  * Byte 1: 'C' i.e. 67
  * Byte 2: Has value if this is a heartbeat, not a cursor change.
  * Bytes 2-5: Row Position
  * Bytes 5-9: Column Position