// Utility functions for Electron environment
export const isElectron = () => {
  return !!(window && window.process && window.process.type);
};

export const getPlatform = () => {
  return isElectron() ? window.electronAPI?.platform : 'web';
};

export const useElectronAPI = () => {
  if (isElectron() && window.electronAPI) {
    return window.electronAPI;
  }
  return null;
};