"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = __importDefault(require("child_process"));
var core_browser_1 = require("@bldr/core-browser");
function default_1() {
    var p = child_process_1.default.spawnSync('systemctl', [
        '--user',
        'restart',
        'baldr_api.service'
    ]);
    if (p.status !== 0) {
        throw new Error('The restart of the systemd service “baldr_api.service” failed!');
    }
    (0, core_browser_1.msleep)(1500);
}
exports.default = default_1;
