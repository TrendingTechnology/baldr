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
const config_ng_1 = require("@bldr/config-ng");
const config = config_ng_1.getConfig();
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new cli_utils_1.CommandRunner();
        cmd.checkRoot();
        cmd.startSpin();
        cmd.log('Pull the Vue builds from the remote web server.');
        yield cmd.exec([
            'rsync',
            '-av',
            '--delete',
            '--exclude',
            'logs',
            `${config.mediaServer.sshAliasRemote}:${config.http.webRoot}/`,
            `${config.http.webRoot}/`
        ]);
        cmd.log('Fixing the ownership of the Vue builds.');
        yield cmd.exec([
            'chown',
            '-R',
            `${config.http.webServerUser}:${config.http.webServerUser}`,
            config.http.webRoot
        ]);
        cmd.stopSpin();
    });
}
module.exports = action;
