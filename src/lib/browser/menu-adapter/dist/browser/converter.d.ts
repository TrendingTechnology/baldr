import type { Shell, BrowserWindow } from 'electron';
import type { RawMenuItem, WebappMenuItem, ElectronMenuItem } from './main';
export declare function convertMenuItemWebapp(raw: RawMenuItem, router: any, actions: any): WebappMenuItem | undefined;
export declare function convertMenuItemElectron(raw: RawMenuItem, payload: any): ElectronMenuItem;
export declare function getEletronMenuDef(shell: Shell, win: BrowserWindow): void;
