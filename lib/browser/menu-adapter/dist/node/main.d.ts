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
import { Shell, BrowserWindow } from 'electron';
import VueRouter from 'vue-router';
import { ElectronMenuItem, WebappMenuItem } from './menu-item';
export { WebappMenuItem } from './menu-item';
export declare function getEletronMenuDef(shell: Shell, window: BrowserWindow): ElectronMenuItem[];
export declare function getWebappMenuDef(router: VueRouter, actions: any): WebappMenuItem[];
export declare function registerShortcuts(router: VueRouter, shortcuts: any, actions: any): void;
