/**
 * Provide a unifed interface for both the Electron and the @bldr/menu menu
 * components.
 *
 * src/vue/apps/lamp/src/MainApp.vue
 *
 * src/vue/apps/lamp/src/components/DropDownMenu.vue
 *
 * @module @bldr/menu-adapter
 */
import type { Shell, BrowserWindow } from 'electron';
import { ElectronMenuItem, WebappMenuItem } from './menu-item';
export declare function getEletronMenuDef(shell: Shell, window: BrowserWindow): ElectronMenuItem[];
export declare function getWebappMenuDef(router: any, actions: any): WebappMenuItem[];
export declare function registerShortcuts(router: any, shortcuts: any, actions: any): any[];
