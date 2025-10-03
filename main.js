const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

let lastText = '';
let history = [];

const MAX_ITEMS = 100;
const POLL_TIME = 1000; // milliseconds

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 300,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

function startClipboardWatcher() {
    setInterval(() => {
        const currentText = clipboard.readText();
        if (!currentText || currentText === lastText) {
            return;
        };
        lastText = currentText;
        
        if (history.indexOf(currentText) !== -1) {
            history = history.filter(item => item !== currentText);
        };
        history.unshift(currentText);
        if (history.length > MAX_ITEMS) {
            history.pop();
        };

        broadcastHistory();
    }, POLL_TIME);
}

ipcMain.handle('get-history', () => history);
ipcMain.handle('clear-history', () => {
    history = [];
});
ipcMain.handle('set-clipboard', (e, text) => {
    clipboard.writeText(text);
    lastText = text;
});
ipcMain.handle('delete-item', (e, text) => {
    history = history.filter(item => item !== text);
    if (text === lastText) {
        lastText = '';
    }
});

function broadcastHistory() {
    if (mainWindow) {
        mainWindow.webContents.send('history-updated', history);
    }
}


app.whenReady().then(() => {
    createWindow();
    startClipboardWatcher();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});