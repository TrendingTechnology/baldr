"use strict";
// Node packages.
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
const core_browser_1 = require("@bldr/core-browser");
function action(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new cli_utils_1.CommandRunner({
            verbose: true
        });
        const extension = (0, core_browser_1.getExtension)(filePath);
        if (extension != null) {
            const dest = filePath.replace('.' + extension, '_no-metadata.' + extension);
            cmd.startSpin();
            yield cmd.exec([
                'ffmpeg', '-i', filePath,
                '-map_metadata', '-1',
                '-c:v', 'copy', '-c:a', 'copy',
                dest
            ]);
            cmd.stopSpin();
        }
    });
}
module.exports = action;
