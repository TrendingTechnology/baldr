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

import { ipcRenderer } from 'electron'

window.ipcRenderer = ipcRenderer
