import type { MenuItemConstructorOptions } from 'electron';
import type VueRouter from 'vue-router';
export declare type ElectronMenuItem = MenuItemConstructorOptions;
export interface UniversalMenuItem {
    /**
     * A short label of the menu entry.
     */
    label: string;
    /**
     * A longer description of the menu entry.
     */
    description?: string;
    /**
     * Arguments for the action, for example a callback name or a route name or a URL.
     */
    arguments?: any;
    /**
     * Keyboard shortcuts to pass through mousetrap
     *   and to pass through the Electron Accelerator.
     */
    keyboardShortcut?: string;
    activeOnRoutes?: string[];
}
export interface UniversalLeafMenuItem extends UniversalMenuItem {
    action: 'pushRouter' | 'openExternalUrl' | 'executeCallback' | 'clearCache';
}
export interface UniversalInnerMenuItem extends UniversalMenuItem {
    /**
     * A array of menu entries to build a sub menu from.
     */
    submenu?: RawMenuItem[];
}
export declare type RawMenuItem = ElectronMenuItem | UniversalLeafMenuItem | UniversalInnerMenuItem;
export interface WebappMenuItem {
    label: string;
    click: () => void;
    keyboardShortcut?: string;
}
export interface ActionCollection {
    [actionName: string]: () => void;
}
export declare function convertMenuItemWebapp(raw: RawMenuItem, payload: any): WebappMenuItem | undefined;
export declare function convertMenuItemElectron(raw: RawMenuItem, payload: any): ElectronMenuItem;
/**
 * @param keys - A raw keyboard shortcut specification.
 * @param forClient - For which client the shortcuts have to
 *   normalized. Possible values are “mousetrap” or “electron” (Accelerator.)
 */
export declare function normalizeKeyboardShortcuts(keys: string, forClient?: 'mousetrap' | 'electron'): string;
interface RegisterShortcutsPayload {
    router: VueRouter;
    shortcuts: any;
    actions: ActionCollection;
}
export declare function registerShortcut(raw: RawMenuItem, payload: RegisterShortcutsPayload): void;
export {};
