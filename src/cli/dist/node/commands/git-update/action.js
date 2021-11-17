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
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const config_1 = require("@bldr/config");
const config = config_1.getConfig();
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new cli_utils_1.CommandRunner({ verbose: true });
        cmd.startSpin();
        cmd.log('Commiting local changes in the media repository.');
        yield cmd.exec(['git', 'add', '-Av'], { cwd: config.mediaServer.basePath });
        try {
            yield cmd.exec(['git', 'commit', '-m', 'Auto-commit'], {
                cwd: config.mediaServer.basePath
            });
        }
        catch (error) { }
        cmd.log('Pull remote changes into the local media repository.');
        yield cmd.exec(['git', 'pull'], { cwd: config.mediaServer.basePath });
        cmd.log('Push local changes into the remote media repository.');
        yield cmd.exec(['git', 'push'], { cwd: config.mediaServer.basePath });
        cmd.log('Updating the local MongoDB database.');
        yield cmd.exec(['curl', 'http://localhost/api/media/mgmt/update']);
        cmd.stopSpin();
    });
}
module.exports = action;
