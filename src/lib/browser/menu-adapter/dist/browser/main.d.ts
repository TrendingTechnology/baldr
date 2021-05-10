/**
 * Provide a unifed interface for both the Electron and the @bldr/menu menu
 * components.
 *
 * @module @bldr/menu-adapter
 */
interface RawMenuItem {
    /**
     * A short label of the menu entry.
     */
    label: string;
    /**
     * A longer description of the menu entry.
     */
    description?: string;
    action?: 'pushRoute' | 'openExternalUrl' | 'executeCallback';
    /**
     * Arguments for the action, for example a callback name or a route name or a URL.
     */
    arguments?: any;
    /**
     * A array of menu entries to build a sub menu from.
     */
    submenu?: RawMenuItem[];
    /**
     * Keyboard shortcuts to pass through mousetrap
     *   and to pass through the Electron Accelerator.
     */
    keyboardShortcut?: string;
    activeOnRoutes?: string[];
}
/**
 * @param keys - A raw keyboard shortcut specification.
 * @param forClient - For which client the shortcuts have to
 *   normalized. Possible values are “mousetrap” or “electron” (Accelerator.)
 */
export declare function normalizeKeyboardShortcuts(keys: string, forClient?: 'mousetrap' | 'electron'): string;
/**
 * @param input - An array of raw menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
export declare function traverseMenu(input: RawMenuItem[], func: (input: RawMenuItem) => any): any[];
declare const menuTemplate: ({
    label: string;
    submenu: ({
        label: string;
        submenu: {
            label: string;
            desciption: string;
            action: string;
            arguments: string;
            keyboardShortcut: string;
        }[];
        role?: undefined;
    } | {
        role: string;
        label?: undefined;
        submenu?: undefined;
    })[];
} | {
    label: string;
    submenu: ({
        label: string;
        action: string;
        arguments: string;
        keyboardShortcut: string;
        submenu?: undefined;
    } | {
        label: string;
        submenu: {
            label: string;
            action: string;
            arguments: string;
            keyboardShortcut: string;
        }[];
        action?: undefined;
        arguments?: undefined;
        keyboardShortcut?: undefined;
    } | {
        label: string;
        submenu: {
            label: string;
            action: string;
            arguments: string;
            keyboardShortcut: string;
            activeOnRoutes: string[];
        }[];
        action?: undefined;
        arguments?: undefined;
        keyboardShortcut?: undefined;
    })[];
} | {
    label: string;
    submenu: ({
        label: string;
        description: string;
        action: string;
        arguments: string;
        keyboardShortcut: string;
        submenu?: undefined;
    } | {
        label: string;
        submenu: ({
            label: string;
            action: string;
            arguments: string;
            keyboardShortcut: string;
            description?: undefined;
        } | {
            label: string;
            description: string;
            action: string;
            arguments: string;
            keyboardShortcut: string;
        })[];
        description?: undefined;
        action?: undefined;
        arguments?: undefined;
        keyboardShortcut?: undefined;
    })[];
} | {
    label: string;
    submenu: ({
        label: string;
        description: string;
        action: string;
        arguments: string;
        keyboardShortcut: string;
    } | {
        label: string;
        action: string;
        arguments: string;
        keyboardShortcut: string;
        description?: undefined;
    })[];
} | {
    label: string;
    submenu: ({
        role: string;
        label?: undefined;
        action?: undefined;
        keyboardShortcut?: undefined;
        arguments?: undefined;
    } | {
        label: string;
        action: string;
        keyboardShortcut: string;
        role?: undefined;
        arguments?: undefined;
    } | {
        label: string;
        action: string;
        arguments: string;
        keyboardShortcut: string;
        role?: undefined;
    } | {
        label: string;
        action: string;
        arguments: string;
        role?: undefined;
        keyboardShortcut?: undefined;
    })[];
})[];
export default menuTemplate;
