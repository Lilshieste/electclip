const {
  app,
  globalShortcut,
  screen,
  BrowserWindow,
  Menu,
  Tray } = require('electron');
const { generateHistoryContent, History } = require('./history');
const {ClipboardMonitor } = require('./clipboardMonitor');

const globals = {
  tray: null,
  history: new History(),
  monitor: new ClipboardMonitor(),
};

function showHistory () {
  const pos = screen.getCursorScreenPoint();

  const win = new BrowserWindow({
    width: 200,
    height: 200,
    x: pos.x,
    y: pos.y,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
    },
  });

  win.on("blur", () => {
    win.close();
  });

  //const html = '<html><body>Hello World!</body></html>';

  const html = generateHistoryContent(globals.history);
  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
  //win.loadFile('table.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
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
