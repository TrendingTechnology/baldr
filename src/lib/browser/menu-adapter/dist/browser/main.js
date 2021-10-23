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
import { convertMenuItemElectron, convertMenuItemWebapp, registerShortcut } from './menu-item';
import { universalMenuDefinition } from './definition';
export function getEletronMenuDef(shell, window) {
    return traverseMenu(universalMenuDefinition, convertMenuItemElectron, {
        shell,
        window
    });
}
export function getWebappMenuDef(router, actions) {
    return traverseMenu(universalMenuDefinition, convertMenuItemWebapp, {
        router,
        actions
    });
}
export function registerShortcuts(router, shortcuts, actions) {
    traverseMenu(universalMenuDefinition, registerShortcut, {
        router,
        shortcuts,
        actions
    });
}
