"use strict";
// Project packages:
const cli_utils_1 = require("@bldr/cli-utils");
/**
 * Open a Vue app in Chromium.
 *
 * @param relPath - The relative path of the Vue app. The app name must
 *   be the same as the parent directory.
 */
function action(relPath) {
    if (!relPath)
        relPath = 'presentation';
    const cmd = new cli_utils_1.CommandRunner();
    cmd.exec(['/usr/bin/chromium-browser',
        `--app=http://localhost/${relPath}`], { detached: true });
}
module.exports = action;
