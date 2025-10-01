const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getHistory: () => ipcRenderer.invoke('get-history'),
    clearHistory: () => ipcRenderer.invoke('clear-history'),
    setClipboard: (text) => ipcRenderer.invoke('set-clipboard', text),
    deleteItem: (text) => ipcRenderer.invoke('delete-item', text)
});