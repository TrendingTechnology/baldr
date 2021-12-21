/**
 * Create the main Electron process.
 *
 * @module @bldr/lamp/background
 */
import { app, protocol, BrowserWindow, Menu, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import contextMenu from 'electron-context-menu'

import { getEletronMenuDef } from '@bldr/menu-adapter'

const isDevelopment = process.env.NODE_ENV !== 'production'

let win: BrowserWindow | null

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

contextMenu({
  prepend: (defaultActions, params, browserWindow) => [
    {
      label: 'Rainbow',
      visible: params.mediaType === 'image'
    },
    {
      label: 'Search Google for “{selection}”',
      visible: params.selectionText.trim().length > 0,
      click: () => {
        shell.openExternal(
          `https://google.com/search?q=${encodeURIComponent(
            params.selectionText
          )}`
        )
      }
    }
  ]
})

const disposeContextMenu = contextMenu()

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION != null,
      webSecurity: false,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, 'preload.js'),
      disableHtmlFullscreenWindowResize: false
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
  const menu = Menu.buildFromTemplate(getEletronMenuDef(shell, win))
  Menu.setApplicationMenu(menu)
  disposeContextMenu()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
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
