"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let config;
/**
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
 */
function getConfig() {
    if (config == null) {
        const configFile = path_1.default.join(path_1.default.sep, 'etc', 'baldr.json');
        if (fs_1.default.existsSync(configFile)) {
            config = require(configFile);
        }
        if (config == null) {
            throw new Error(`No configuration file found: ${configFile}`);
        }
        return config;
    }
    return config;
}
exports.getConfig = getConfig;
