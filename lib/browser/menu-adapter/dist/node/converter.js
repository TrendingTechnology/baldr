"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebappMenuDef = exports.getEletronMenuDef = exports.convertMenuItemElectron = exports.convertMenuItemWebapp = void 0;
const definition_1 = require("./definition");
const traverse_1 = require("./traverse");
function convertMenuItemWebapp(raw, payload) {
    const p = payload;
    const router = p.router;
    const actions = p.actions;
    if ('role' in raw)
        return;
    const universal = raw;
    // label
    if (universal.label == null) {
        throw new Error('Raw menu entry needs a key named label');
    }
    const label = universal.label;
    // click
    if (!('action' in universal)) {
        throw new Error(`Raw menu entry needs a key named action: ${universal.label}`);
    }
    const universalLeaf = universal;
    let click;
    if (universalLeaf.action === 'openExternalUrl') {
    }
    else if (universalLeaf.action === 'pushRouter') {
        click = () => {
            router.push({ name: universalLeaf.arguments });
        };
    }
    else if (universalLeaf.action === 'clearCache') {
        // Only in the electron app. Clear HTTP Cache.
        return;
    }
    else if (universalLeaf.action === 'executeCallback') {
        click = actions[universalLeaf.arguments];
    }
    else {
        throw new Error(`Unkown action for raw menu entry: ${universalLeaf.label}`);
    }
    if (click == null)
        return;
    const result = {
        label,
        click
    };
    result.click = click;
    if (universalLeaf.keyboardShortcut != null) {
        result.keyboardShortcut = universalLeaf.keyboardShortcut;
    }
    return result;
}
exports.convertMenuItemWebapp = convertMenuItemWebapp;
function convertMenuItemElectron(raw, payload) {
    const p = payload;
    const shell = p.shell;
    const window = p.window;
    if ('role' in raw)
        return raw;
    // label
    const result = {};
    const universal = raw;
    if (universal.label == null) {
        throw new Error('Raw menu entry needs a key named label');
    }
    result.label = raw.label;
    // click
    if (!('action' in universal)) {
        throw new Error(`Raw menu entry needs a key named action: ${universal.label}`);
    }
    const universalLeaf = universal;
    let click;
    if (universalLeaf.action === 'openExternalUrl') {
        click = () => __awaiter(this, void 0, void 0, function* () {
            yield shell.openExternal(universalLeaf.arguments);
        });
    }
    else if (universalLeaf.action === 'pushRouter') {
        click = () => {
            window.webContents.send('navigate', { name: universalLeaf.arguments });
        };
    }
    else if (universalLeaf.action === 'executeCallback') {
        click = () => {
            window.webContents.send('action', universalLeaf.arguments);
        };
    }
    else if (universalLeaf.action === 'clearCache') {
        click = () => {
            // Sometimes some images are not updated.
            // We have to delete the http cache.
            // Cache location on Linux: /home/<user>/.config/baldr-lamp/Cache
            window.webContents.session.clearCache().then(() => { }, () => { });
            window.webContents.session.clearStorageData().then(() => { }, () => { });
        };
    }
    else {
        throw new Error(`Unkown action for raw menu entry: ${universalLeaf.label}`);
    }
    result.click = click;
    // accelerator
    if (universalLeaf.keyboardShortcut != null) {
        result.accelerator = universalLeaf.keyboardShortcut;
        // We handle the keyboard shortcuts on the render process side with
        // mousetrap.
        result.registerAccelerator = false;
    }
    return result;
}
exports.convertMenuItemElectron = convertMenuItemElectron;
function getEletronMenuDef(shell, window) {
    return traverse_1.traverseMenu(definition_1.universalMenuDefinition, convertMenuItemElectron, { shell, window });
}
exports.getEletronMenuDef = getEletronMenuDef;
function getWebappMenuDef(router, actions) {
    return traverse_1.traverseMenu(definition_1.universalMenuDefinition, convertMenuItemWebapp, { router, actions });
}
exports.getWebappMenuDef = getWebappMenuDef;
