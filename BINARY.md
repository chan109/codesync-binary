# Binary API.
This is for all communication binary-binary.

---
### Cursor Position
This should be updated everytime the cursor position changes

* **Size:** 7 bytes (will be updated soon, when we add multi-files).
* **Data Structure:** 
  * Byte 1: 'C' i.e. 67
  * Bytes 2-5: Row/Line Position
  * Bytes 5-9: Column/Character Position
* **Extra Notes:**
  * The row and column numbers are written in big endian.
