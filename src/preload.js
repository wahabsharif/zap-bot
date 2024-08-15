// src/preload.js
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Define methods that can be exposed to the renderer process
});
