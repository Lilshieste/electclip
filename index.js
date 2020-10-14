const {
  app,
  globalShortcut,
  ipcMain,
  screen,
  BrowserWindow,
  Menu,
  Tray, 
  clipboard} = require('electron');
const { generateHistoryContent, History } = require('./history');
const {ClipboardMonitor } = require('./clipboardMonitor');

const globals = {
  tray: null,
  history: new History(),
  monitor: new ClipboardMonitor(),
  historyWindow: null,
};

function showHistory () {
  const pos = screen.getCursorScreenPoint();

  globals.historyWindow.webContents.send('update-items', globals.history.items);

  globals.historyWindow.setPosition(pos.x, pos.y);
  globals.historyWindow.show();
}

const fromBase64 = (str) => {
  return Buffer.from(str, 'base64').toString('utf8');
}

ipcMain.on('history-page-is-ready', (event, arg) => {
});

ipcMain.on('selected-item-in-base64', (event, arg) => {
  const value = fromBase64(arg);
  clipboard.writeText(value);
  globals.historyWindow.hide();
});

ipcMain.on('log', (event, arg) => {
  console.log(arg);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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
  globals.historyWindow.loadFile('table.html');

  globals.tray = new Tray('/Users/joemiller/Downloads/blue_curve.png');
  const trayMenu = Menu.buildFromTemplate([
    { label: 'About',           role: 'about' },
    { label: 'History', click: () => showHistory()},
    { label: 'Separator',       type: 'separator'},
    { label: 'Quit',            role: 'quit' },
  ]);
  globals.tray.setToolTip('Electclip v1.0');
  globals.tray.setContextMenu(trayMenu);

  globalShortcut.register('Command+`', () => {
    showHistory();
  });

  globals.monitor.on('copied', (value) => {
    globals.history.addItem(value);
  });

  globals.monitor.start();

  globals.history.addItem('Value 4');
  globals.history.addItem('Value 5');
  globals.history.addItem('Value 6');
  globals.history.addItem('Value 43');
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
