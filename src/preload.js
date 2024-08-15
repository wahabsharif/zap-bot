const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  handleMessage: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
});
