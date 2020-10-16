const {
  app,
  globalShortcut,
  ipcMain,
  screen,
  BrowserWindow,
  Menu,
  Tray, 
  clipboard} = require('electron');
const { History } = require('./history');
const { ClipboardMonitor } = require('./clipboardMonitor');

const globals = {
  history: new History(),
  monitor: new ClipboardMonitor(clipboard),

  // Wait to instantiate these until after the app is 'ready'
  tray: null,
  historyWindow: null,
};

function showHistory () {
  const pos = screen.getCursorScreenPoint();

  globals.historyWindow.webContents.send('update-items', globals.history.items);

  globals.historyWindow.setPosition(pos.x, pos.y);
  globals.historyWindow.show();
}

ipcMain.on('history-page-is-ready', (event, arg) => {
});

ipcMain.on('selected-index', (event, arg) => {
  const value = globals.history.items[arg];
  clipboard.writeText(value);
  globals.historyWindow.hide();
});

ipcMain.on('cancel', (event, arg) => {
  globals.historyWindow.hide();
});

ipcMain.on('log', (event, arg) => {
  console.log(arg);
});

app.whenReady().then(() => {
  globals.historyWindow = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
  });
  globals.historyWindow.on("blur", () => {
    globals.historyWindow.hide();
    app.hide();
  });
  globals.historyWindow.loadFile('historyDisplay.html');

  globals.tray = new Tray('/Users/joemiller/Downloads/blue_curve.png');
  const trayMenu = Menu.buildFromTemplate([
    { label: 'About',           role: 'about' },
    { label: 'History', click: () => showHistory()},
    { label: 'Separator',       type: 'separator'},
    { label: 'Quit',            role: 'quit' },
  ]);
  globals.tray.setToolTip('Electclip v0.9');
  globals.tray.setContextMenu(trayMenu);

  globalShortcut.register('Command+`', () => {
    showHistory();
  });

  globals.monitor.on('copied', (value) => {
    globals.history.addItem(value);
  });

  globals.monitor.start();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    globals.monitor.stop();
    app.quit()
  }
});

app.on('activate', () => {
});

app.dock.hide();
