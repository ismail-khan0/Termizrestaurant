const { contextBridge } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
  isElectron: true,
  
  // Add utility methods that might be useful for your POS system
  getAppVersion: () => {
    return require('../../package.json').version;
  },
  
  // Example: If you need file system operations for reports/backups
  showSaveDialog: async (options) => {
    const { dialog } = require('electron');
    const result = await dialog.showSaveDialog(options);
    return result;
  },
  
  // Example: For printing receipts
  printReceipt: (htmlContent) => {
    const { ipcRenderer } = require('electron');
    // You would set up IPC communication here
    console.log('Print receipt:', htmlContent);
  }
});

console.log('🔗 Preload script loaded successfully - Electron APIs exposed');