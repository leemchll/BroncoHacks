/**
 * @file main.jsx
 * @description Entry point for the React app. Mounts App into the DOM.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * Render the React app into the root div in index.html
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);