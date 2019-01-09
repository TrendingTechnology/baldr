/**
 * @file Main process.
 * @module baldr
 */

'use strict'

const path = require('path')
const url = require('url')

const {
  app,
  BrowserWindow,
  Menu,
  shell
} = require('electron')

let mainWindow

/**
 * Build menu for the main process.
 * @function buildMenu
 */
let buildMenu = function () {
  const template = [
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },

        { type: 'separator' },

        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },

        { type: 'separator' },

        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Baldr documentation',
          click () { shell.openExternal('https://josef-friedrich.github.io/baldr') }
        },
        {
          label: 'Electron documentation',
          click () { shell.openExternal('https://electron.atom.io/docs') }
        },
        {
          label: 'Node documentation',
          click () { shell.openExternal('https://nodejs.org/api') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },

        { type: 'separator' },

        { role: 'services', submenu: [] },

        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },

        { type: 'separator' },

        { role: 'quit' }
      ]
    })

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    )

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }

  Menu.setApplicationMenu(
    Menu.buildFromTemplate(template)
  )
}

let loadURL = function () {
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, ...arguments),
    protocol: 'file:',
    slashes: true
  }))
}

/**
 * Create render window.
 * @function createWindow
 */
let createWindow = function () {
  mainWindow = new BrowserWindow({ width: 800, height: 600 })
  loadURL('render.html')
  buildMenu()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

/**
 * Open a new window on Mac OS, if a *.baldr file is dragged to the
 * app icon. The path of the *.baldr file is added to the process.argv
 * array.
 */
app.on('open-file', function (event, path) {
  // TODO: Overwrite args which are already *.baldr file paths.
  process.argv.push(path)
  if (app.isReady()) {
    createWindow()
  }
})

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
