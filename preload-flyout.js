const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('flyoutAPI', {
  onUsageData: (callback) => {
    ipcRenderer.on('flyout-usage-data', (event, data) => callback(data));
  },
  onThemeChanged: (callback) => {
    ipcRenderer.on('flyout-theme', (event, theme) => callback(theme));
  },
  requestRefresh: () => ipcRenderer.send('flyout-refresh'),
  openWidget: () => ipcRenderer.send('flyout-open-widget'),
  openSettings: () => ipcRenderer.send('flyout-open-settings'),
  getInitialState: () => ipcRenderer.invoke('flyout-get-initial-state'),
  platform: process.platform
});
