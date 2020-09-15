// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#preload-files
import { ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer
