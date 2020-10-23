import {
  app,
  globalShortcut,
  ipcMain,
  screen,
  BrowserWindow,
  Menu,
  Tray, 
  clipboard }  from 'electron';
import { History, loadHistory, saveHistory } from './history';
import { ClipboardMonitor } from './clipboardMonitor';

const HISTORY_FILE = 'electclip.history';

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

const getHistoryFilename = () => `${app.getPath('userData')}/${HISTORY_FILE}`;

async function initializeHistory() {
  return await loadHistory(getHistoryFilename());
}

const saveCurrentHistory = async () => {
  return saveHistory(history, getHistoryFilename());
}

function initializeClipboardMonitor(clipboard: Electron.Clipboard) {
  const monitor = new ClipboardMonitor(clipboard);
  monitor.on('copied', (value: any) => {
    history.addItem(value);
    saveCurrentHistory();
  });

  return monitor;
}

function initializeSystemTray(history: History, historyWindow: BrowserWindow) {
  const tray = new Tray('/Users/joemiller/Downloads/blue_curve.png')
  const trayMenu = Menu.buildFromTemplate([
    { label: 'About',         role: 'about' },
    { label: 'History',       click: () => showHistory(history, historyWindow)},
    { label: 'Separator',     type: 'separator'},
    { label: 'Quit',          role: 'quit' },
  ]);

  tray.setToolTip('Electclip v0.9');
  tray.setContextMenu(trayMenu);

  return tray;
}

function initializeHistoryWindow() {
  const win = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
  });

  win.on("blur", () => {
    historyWindow.hide();
    app.hide();
  });

  return win;
}

function initializeAppEventHandlers(clipboardMonitor: ClipboardMonitor) {
  ipcMain.on('history-page-is-ready', (event, arg) => {
  });
  
  ipcMain.on('selected-index', (event, arg) => {
    const value = history.popItemAt(arg);

    clipboard.writeText(value.item);
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
}

app.whenReady().then(async () => {
  history = await initializeHistory();
  clipboardMonitor = initializeClipboardMonitor(clipboard);
  historyWindow = initializeHistoryWindow();
  tray = initializeSystemTray(history, historyWindow);

  initializeAppEventHandlers(clipboardMonitor);
  
  historyWindow.loadFile('src/historyDisplay.html');
  clipboardMonitor.start();
  globalShortcut.register('Command+`', () => {
    showHistory(history, historyWindow);
  });

  app.dock.hide();
});
