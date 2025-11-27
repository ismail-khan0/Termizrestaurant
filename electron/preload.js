const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // You can add IPC methods here if needed
});
