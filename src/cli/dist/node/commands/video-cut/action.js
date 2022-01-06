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
const core_browser_1 = require("@bldr/core-browser");
function action(videoFilePath, time1, time2) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new cli_utils_1.CommandRunner({ verbose: true });
        let startSec = 0;
        let endSec;
        if (time2 == null) {
            endSec = (0, core_browser_1.convertHHMMSSToSeconds)(time1);
        }
        else {
            startSec = (0, core_browser_1.convertHHMMSSToSeconds)(time1);
            endSec = (0, core_browser_1.convertHHMMSSToSeconds)(time2);
        }
        cmd.startSpin();
        yield cmd.exec([
            'MP4Box',
            '-splitx',
            `${startSec}:${endSec}`,
            '"' + videoFilePath + '"'
        ]);
        cmd.stopSpin();
    });
}
module.exports = action;
