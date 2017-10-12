const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let win;

function mirrorMonitors(state) {
  if (process.platform === 'darwin') {
    var exec = require('child_process').exec;
    var child;

    child = exec('/usr/local/bin/mirror -' + state, function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }
}

function createWindow() {
  win = new BrowserWindow({fullscreen: true});

  win.loadURL(`file://${__dirname}/app/index.html`);
  //win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

mirrorMonitors('on');

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  mirrorMonitors('off');
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
