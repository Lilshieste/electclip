import {
  app,
  globalShortcut,
  ipcMain,
  screen,
  BrowserWindow,
  Menu,
  Tray, 
  clipboard }  from 'electron';
import { History } from './history';
import { ClipboardMonitor } from './clipboardMonitor';

let clipboardMonitor: ClipboardMonitor;
let history: History;
let historyWindow: BrowserWindow;
let tray: Tray;

function showHistory (history: History, historyWindow: BrowserWindow) {
  const pos = screen.getCursorScreenPoint();

  historyWindow.webContents.send('update-items', history.items);

  historyWindow.setPosition(pos.x, pos.y);
  historyWindow.show();
}

app.whenReady().then(() => {
  clipboardMonitor = new ClipboardMonitor(clipboard);
  history = new History();

  historyWindow = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
  });

  tray = new Tray('/Users/joemiller/Downloads/blue_curve.png');

  historyWindow.on("blur", () => {
    historyWindow.hide();
    app.hide();
  });

  const trayMenu = Menu.buildFromTemplate([
    { label: 'About',         role: 'about' },
    { label: 'History',       click: () => showHistory(history, historyWindow)},
    { label: 'Separator',     type: 'separator'},
    { label: 'Quit',          role: 'quit' },
  ]);

  tray.setToolTip('Electclip v0.9');
  tray.setContextMenu(trayMenu);

  clipboardMonitor.on('copied', (value: any) => {
    history.addItem(value);
  });

  ipcMain.on('history-page-is-ready', (event, arg) => {
  });
  
  ipcMain.on('selected-index', (event, arg) => {
    const value = history.items[arg];
    clipboard.writeText(value);
    historyWindow.hide();
  });
  
  ipcMain.on('cancel', (event, arg) => {
    historyWindow.hide();
  });
  
  ipcMain.on('log', (event, arg) => {
    console.log(arg);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      clipboardMonitor.stop();
      app.quit()
    }
  });
  
  app.on('activate', () => {
  });
  
  historyWindow.loadFile('src/historyDisplay.html');
  clipboardMonitor.start();
  globalShortcut.register('Command+`', () => {
    showHistory(history, historyWindow);
  });
  app.dock.hide();
});
