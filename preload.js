const { contextBridge, ipcRenderer } = require('electron');

function onHistoryUpdated(callback) {
    ipcRenderer.on('history-updated', (e, history) => {
        callback(history);
    });
}

contextBridge.exposeInMainWorld('api', {
    getHistory: () => ipcRenderer.invoke('get-history'),
    clearHistory: () => ipcRenderer.invoke('clear-history'),
    setClipboard: (text) => ipcRenderer.invoke('set-clipboard', text),
    deleteItem: (text) => ipcRenderer.invoke('delete-item', text),
    onHistoryUpdated
});