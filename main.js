/**
 * @file Main process.
 */

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const path = require('path');
const url = require('url');

let mainWindow;

function buildMenu() {
  const template = [
    {
      label: 'View',
      submenu: [

        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},

        {type: 'separator'},

        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},

        {type: 'separator'},

        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electron.atom.io'); }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},

        {type: 'separator'},

        {role: 'services', submenu: []},

        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},

        {type: 'separator'},

        {role: 'quit'}
      ]
    });

    // Edit menu
    template[1].submenu.push(
      {type: 'separator'},
      {
        label: 'Speech',
        submenu: [
          {role: 'startspeaking'},
          {role: 'stopspeaking'}
        ]
      }
    );

    // Window menu
    template[3].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ];
  }

  Menu.setApplicationMenu(
    Menu.buildFromTemplate(template)
  );
}

function createWindow() {

  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'render.html'),
    protocol: 'file:',
    slashes: true
  }));
  buildMenu();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
