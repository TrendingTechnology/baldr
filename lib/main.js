/**
 * @file Main process
 */

const electron = require('electron');
const {app, BrowserWindow, Menu} = electron;

let win;

/**
 * @param {string} htmlFile The path of the HTML file.
 * @param {string} hash The URL hash starting with “#”
 * @return {string} The formated URL string
 */
var setUrl = function(htmlFile, hash=false) {
  var url = {
    protocol: 'file',
    slashes: true,
    pathname: require('path').join(__dirname, '..', htmlFile)
  };
  if (hash) {
    url.hash = hash;
  }
  return require('url').format(url);
};

const template = [
  {
    label: 'View',
    submenu: [
      {
        label: 'Search',
        click() {win.loadURL(setUrl('index.html', '#search'));}
      },
      {
        label: 'Table of contents',
        click() {win.loadURL(setUrl('index.html', '#tableofcontents'));}
      },

      {type: 'separator'},

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

const menu = Menu.buildFromTemplate(template);

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

  win.loadURL(setUrl('index.html'));

  Menu.setApplicationMenu(menu);
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
