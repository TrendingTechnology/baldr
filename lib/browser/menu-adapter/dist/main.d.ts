/**
 * Provide a unifed interface for both the Electron and the @bldr/menu menu
 * components.
 *
 * src/vue/apps/presentation/src/MainApp.vue
 *
 * src/vue/apps/presentation/src/components/DropDownMenu.vue
 *
 * @module @bldr/menu-adapter
 */
import { Shell, BrowserWindow } from 'electron';
import VueRouter from 'vue-router';
import { RawMenuItem } from './menu-item';
import { ElectronMenuItem, WebappMenuItem } from './menu-item';
export { traverseMenu } from './traverse';
export { ElectronMenuItem, RawMenuItem, WebappMenuItem, convertMenuForElectron, convertMenuForWebapp } from './menu-item';
declare type Actions = {
    [actionName: string]: () => void;
};
export declare function getEletronMenuDef(menu: RawMenuItem[], shell: Shell, window: BrowserWindow): ElectronMenuItem[];
export declare function getWebappMenuDef(menu: RawMenuItem[], router: VueRouter, actions: Actions): WebappMenuItem[];
export declare function registerShortcuts(menu: RawMenuItem[], router: VueRouter, shortcuts: any, actions: Actions): void;
