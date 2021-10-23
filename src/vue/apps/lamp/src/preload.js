/**
 * Access some Electron Node objects using the global window object.
 *
 * Preload files allows to execute JS with Node integration in the context of
 * your Vue App (shared window variable). This file is configured in
 * ./background.js
 *
 * @see
 * {@link https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#preload-files}
 *
 * @module @bldr/lamp/preload
 */

import { contextBridge, ipcRenderer } from 'electron'

// https://stackoverflow.com/a/59814127/10193818
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  ipcRendererOn: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  }
})
