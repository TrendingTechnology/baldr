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
// Node packages.
const path_1 = __importDefault(require("path"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const config_1 = require("@bldr/config");
const config = config_1.getConfig();
/**
 * Serve a Vue web app.
 *
 * @param appName - The name of the Vue app = parent folder of the app.
 */
function action(appName = 'lamp') {
    return __awaiter(this, void 0, void 0, function* () {
        const appPath = path_1.default.join(config.localRepo, 'src', 'vue', 'apps', appName);
        const cmd = new cli_utils_1.CommandRunner({ verbose: true });
        yield cmd.exec(['npm', 'run', 'serve:webapp'], { cwd: appPath });
    });
}
module.exports = action;
