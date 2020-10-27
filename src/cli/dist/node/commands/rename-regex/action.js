// Node packages.
const fs = require('fs');
// Third party packages.
const chalk = require('chalk');
// Project packages.
const mediaServer = require('@bldr/media-server');
/**
 * @param {String} filePath - The media file path.
 *
 * @returns {String}
 */
function renameByRegex(filePath, { pattern, replacement }) {
    const newFilePath = filePath.replace(pattern, replacement);
    if (filePath !== newFilePath) {
        console.log(`\nRename:\n  old: ${chalk.yellow(filePath)} \n  new: ${chalk.green(newFilePath)}`);
        fs.renameSync(filePath, newFilePath);
    }
}
function action(pattern, replacement, filePath) {
    mediaServer.walk(renameByRegex, {
        regex: new RegExp('.*'),
        path: filePath,
        payload: { pattern, replacement }
    });
}
module.exports = action;
