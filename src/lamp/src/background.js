/**
 * Create the main Electron process.
 *
 * @module @bldr/lamp/background
 */

'use strict'

import { app, protocol, BrowserWindow, Menu, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import menuTemplate from './menu.js'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

/**
 * @param {Object} raw
 * @property label - A short label of the menu entry.
 * @property action - For example “pushRoute”, “openExternalUrl”, “execute”
 * @property arguments - Arguments for the action function.
 */
function convertMenuItem (raw) {
  const result = {}
  if (!raw.label) throw new Error(`Raw menu entry needs a key named label: ${raw}`)
  result.label = raw.label
  if (!raw.action) throw new Error(`Raw menu entry needs a key named action: ${raw}`)
  let click
  if (raw.action === 'openExternalUrl') {
    click = async () => {
      await shell.openExternal(raw.arguments)
    }
  } else if (raw.action === 'pushRouter') {
    click = () => {
      win.webContents.send('navigate', { name: raw.arguments })
    }
  } else if (raw.action === 'execute') {
    click = () => {
      win.webContents.send('action', raw.arguments)
    }
  } else {
    throw new Error(`Unkown action for raw menu entry: ${raw}`)
  }
  result.click = click
  return result
}

/**
 * @param {Array} input
 * @param {Array} output
 */
function convertMenuItemList (input, output) {
  for (const rawMenuItem of input) {
    let result
    if (rawMenuItem.submenu) {
      result = {
        label: rawMenuItem.label,
        submenu: convertMenuItemList(rawMenuItem.submenu, [])
      }
    } else {
      result = convertMenuItem(rawMenuItem)
    }
    output.push(result)
  }
  return output
}

/**
 * @param {Array} input
 */
function convertMenu (input) {
  const newMenu = []
  convertMenuItemList(input, newMenu)
  return newMenu
}

const menu = Menu.buildFromTemplate(convertMenu(menuTemplate))
Menu.setApplicationMenu(menu)
