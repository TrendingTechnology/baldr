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

/**
 * Sometimes some images are not updated. We have to delete the HTTP cache.
 *
 * Cache location on Linux: /home/<user>/.config/baldr-lamp/Cache
 *
 * Tool to monitor file changes in a directory:
 *
 * ```
 * inotifywait -m -r $HOME/.config/@bldr/lamp
 * ```
 */
async function clearCache () {
  if (win != null) {
    await win.webContents.session.clearCache()
    await win.webContents.session.clearStorageData()
    // console.log(win.webContents.session.getStoragePath())
    // $HOME/.config/@bldr/lamp
  }
}

contextMenu({
  prepend (defaultActions, params, browserWindow) {
    console.log(defaultActions)
    return [
      {
        label: 'Cache leeren',
        click: () => {
          clearCache()
        }
      },
      {
        label: 'App neu starten',
        click: () => {
          // https://www.electronjs.org/docs/latest/api/app#appexitexitcode
          app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
          app.exit(0)
        }
      },
      {
        label: 'Google-Suche nach “{selection}”',
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
  }
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

app.on('before-quit', () => {
  clearCache()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      const error = e as Error
      console.error('Vue Devtools failed to install:', error.toString())
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
