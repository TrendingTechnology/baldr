var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Node packages.
const path = require('path');
// Project packages.
const { CommandRunner } = require('@bldr/cli-utils');
const config = require('@bldr/config');
/**
 * @param {String} appName The name of the Vue app = parent folder of the app.
 */
function action(appName = 'lamp') {
    return __awaiter(this, void 0, void 0, function* () {
        const appPath = path.join(config.localRepo, 'src', appName);
        const cmd = new CommandRunner({ verbose: true });
        yield cmd.exec(['npm', 'run', 'serve:webapp'], { cwd: appPath });
    });
}
module.exports = action;
