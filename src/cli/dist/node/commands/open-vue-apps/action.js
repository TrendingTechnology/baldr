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
// Project packages:
const cli_utils_1 = require("@bldr/cli-utils");
/**
 * Open a Vue app in Chromium.
 *
 * @param relPath - The relative path of the Vue app. The app name must
 *   be the same as the parent directory.
 */
function action(relPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (relPath == null)
            relPath = 'presentation';
        const cmd = new cli_utils_1.CommandRunner();
        yield cmd.exec(['/usr/bin/chromium-browser',
            `--app=http://localhost/${relPath}`], { detached: true });
    });
}
module.exports = action;
