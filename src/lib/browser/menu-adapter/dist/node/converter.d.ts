import type { Shell, BrowserWindow } from 'electron';
import type { RawMenuItem, WebappMenuItem, ElectronMenuItem } from './main';
export declare function convertMenuItemWebapp(raw: RawMenuItem, payload: any): WebappMenuItem | undefined;
export declare function convertMenuItemElectron(raw: RawMenuItem, payload: any): ElectronMenuItem;
export declare function getEletronMenuDef(shell: Shell, window: BrowserWindow): ElectronMenuItem[];
export declare function getWebappMenuDef(router: any, actions: any): WebappMenuItem[];
