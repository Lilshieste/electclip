"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var history_1 = require("./history");
var clipboardMonitor_1 = require("./clipboardMonitor");
var clipboardMonitor;
var history;
var historyWindow;
var tray;
function showHistory(history, historyWindow) {
    var pos = electron_1.screen.getCursorScreenPoint();
    historyWindow.webContents.send('update-items', history.items);
    historyWindow.setPosition(pos.x, pos.y);
    historyWindow.show();
}
electron_1.app.whenReady().then(function () {
    clipboardMonitor = new clipboardMonitor_1.ClipboardMonitor(electron_1.clipboard);
    history = new history_1.History();
    historyWindow = new electron_1.BrowserWindow({
        width: 200,
        height: 200,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true,
        },
    });
    tray = new electron_1.Tray('/Users/joemiller/Downloads/blue_curve.png');
    historyWindow.on("blur", function () {
        historyWindow.hide();
        electron_1.app.hide();
    });
    var trayMenu = electron_1.Menu.buildFromTemplate([
        { label: 'About', role: 'about' },
        { label: 'History', click: function () { return showHistory(history, historyWindow); } },
        { label: 'Separator', type: 'separator' },
        { label: 'Quit', role: 'quit' },
    ]);
    tray.setToolTip('Electclip v0.9');
    tray.setContextMenu(trayMenu);
    clipboardMonitor.on('copied', function (value) {
        history.addItem(value);
    });
    electron_1.ipcMain.on('history-page-is-ready', function (event, arg) {
    });
    electron_1.ipcMain.on('selected-index', function (event, arg) {
        var value = history.items[arg];
        electron_1.clipboard.writeText(value);
        historyWindow.hide();
    });
    electron_1.ipcMain.on('cancel', function (event, arg) {
        historyWindow.hide();
    });
    electron_1.ipcMain.on('log', function (event, arg) {
        console.log(arg);
    });
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            clipboardMonitor.stop();
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
    });
    historyWindow.loadFile('src/historyDisplay.html');
    clipboardMonitor.start();
    electron_1.globalShortcut.register('Command+`', function () {
        showHistory(history, historyWindow);
    });
    electron_1.app.dock.hide();
});
