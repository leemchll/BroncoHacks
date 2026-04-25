/**
 * @file index.js
 * @description Entry point of the server. Starts the app.
 */

import app from "./app.js";

const PORT = process.env.PORT || 5001;

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});