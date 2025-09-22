const { app, BrowserWindow, clipboard } = require('electron');
const { path } = require('path');

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

app.whenReady().then(() => {
    createWindow();
})