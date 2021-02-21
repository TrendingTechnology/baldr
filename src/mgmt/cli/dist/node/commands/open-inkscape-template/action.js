"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages
const path_1 = __importDefault(require("path"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const config_1 = __importDefault(require("@bldr/config"));
/**
 * Open the Inkscape template.
 */
function action() {
    const cmd = new cli_utils_1.CommandRunner({
        verbose: false
    });
    cmd.exec([
        'inkscape',
        path_1.default.join(config_1.default.mediaServer.basePath, 'Inkscape-Vorlagen', 'Inkscape-Vorlage.svg')
    ], { detached: true });
}
module.exports = action;
