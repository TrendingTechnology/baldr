"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = exports.cmd = void 0;
function cmd(name, content) {
    return `\\${name}{${content}}`;
}
exports.cmd = cmd;
function environment(name, content) {
    return cmd('begin', name) + '\n' +
        content.trim() + '\n' +
        cmd('end', name);
}
exports.environment = environment;
