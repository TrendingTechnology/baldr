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
exports.getWebappMenuDef = exports.getEletronMenuDef = void 0;
var converter_1 = require("./converter");
Object.defineProperty(exports, "getEletronMenuDef", { enumerable: true, get: function () { return converter_1.getEletronMenuDef; } });
Object.defineProperty(exports, "getWebappMenuDef", { enumerable: true, get: function () { return converter_1.getWebappMenuDef; } });
