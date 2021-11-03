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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages
const path_1 = __importDefault(require("path"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const config_ng_1 = require("@bldr/config-ng");
const config = config_ng_1.getConfig();
/**
 * Open the Inkscape template.
 */
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new cli_utils_1.CommandRunner({
            verbose: false
        });
        yield cmd.exec([
            'inkscape',
            path_1.default.join(config.mediaServer.basePath, 'faecheruebergreifend', 'Inkscape-Vorlagen', 'Inkscape-Vorlage.svg')
        ], { detached: true });
    });
}
module.exports = action;
