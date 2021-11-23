"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerShortcuts = exports.getWebappMenuDef = exports.getEletronMenuDef = void 0;
const traverse_1 = require("./traverse");
const menu_item_1 = require("./menu-item");
const definition_1 = require("./definition");
function getEletronMenuDef(shell, window) {
    return (0, traverse_1.traverseMenu)(definition_1.universalMenuDefinition, menu_item_1.convertMenuItemElectron, {
        shell,
        window
    });
}
exports.getEletronMenuDef = getEletronMenuDef;
function getWebappMenuDef(router, actions) {
    return (0, traverse_1.traverseMenu)(definition_1.universalMenuDefinition, menu_item_1.convertMenuItemWebapp, {
        router,
        actions
    });
}
exports.getWebappMenuDef = getWebappMenuDef;
function registerShortcuts(router, shortcuts, actions) {
    (0, traverse_1.traverseMenu)(definition_1.universalMenuDefinition, menu_item_1.registerShortcut, {
        router,
        shortcuts,
        actions
    });
}
exports.registerShortcuts = registerShortcuts;
