// Project packages:
const { CommandRunner } = require('@bldr/cli-utils');
function action(relPath) {
    if (!relPath)
        relPath = 'presentation';
    const cmd = new CommandRunner();
    cmd.exec('/usr/bin/chromium-browser', `--app=http://localhost/${relPath}`, { detached: true });
}
module.exports = action;
