// Node packages.
const childProcess = require('child_process');
// Third party packages.
const chalk = require('chalk');
// Project packages.
const mediaServer = require('@bldr/media-server');
const config = require('@bldr/config');
function action() {
    // In the archive folder are no two letter folders like 'YT'.
    // We try to detect the parent folder where the presentation lies in.
    let presDir = mediaServer.locationIndicator.getPresParentDir(cwd);
    let mirroredPath = mediaServer.locationIndicator.getMirroredPath(presDir);
    // If no mirrored path could be detected we show the base path of the
    // media server.
    if (!mirroredPath)
        mirroredPath = config.mediaServer.basePath;
    console.log(`Go to: ${chalk.green(mirroredPath)}`);
    childProcess.spawn('zsh', ['-i'], {
        cwd: mirroredPath,
        stdio: 'inherit'
    });
}
module.exports = action;
