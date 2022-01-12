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
import { traverseMenu } from './traverse';
import { convertMenuForElectron, convertMenuForWebapp, registerShortcut } from './menu-item';
export { traverseMenu } from './traverse';
export { convertMenuForElectron, convertMenuForWebapp } from './menu-item';
export function getEletronMenuDef(menu, shell, window) {
    return traverseMenu(menu, convertMenuForElectron, {
        shell,
        window
    });
}
export function getWebappMenuDef(menu, router, actions) {
    return traverseMenu(menu, convertMenuForWebapp, {
        router,
        actions
    });
}
export function registerShortcuts(menu, router, shortcuts, actions) {
    traverseMenu(menu, registerShortcut, {
        router,
        shortcuts,
        actions
    });
}
