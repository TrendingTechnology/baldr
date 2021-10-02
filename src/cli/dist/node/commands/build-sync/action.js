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
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const config_1 = __importDefault(require("@bldr/config"));
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
            '--exclude', 'logs',
            `${config_1.default.mediaServer.sshAliasRemote}:${config_1.default.http.webRoot}/`,
            `${config_1.default.http.webRoot}/`
        ]);
        cmd.log('Fixing the ownership of the Vue builds.');
        yield cmd.exec([
            'chown',
            '-R',
            `${config_1.default.http.webServerUser}:${config_1.default.http.webServerUser}`,
            config_1.default.http.webRoot
        ]);
        cmd.stopSpin();
    });
}
module.exports = action;
