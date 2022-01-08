// Project packages.
import { CommandRunner } from '@bldr/cli-utils';
import { getConfig } from '@bldr/config';
const config = getConfig();
export default async function action() {
    const cmd = new CommandRunner({ verbose: true });
    cmd.startSpin();
    cmd.log('Commiting local changes in the media repository.');
    await cmd.exec(['git', 'add', '-Av'], { cwd: config.mediaServer.basePath });
    try {
        await cmd.exec(['git', 'commit', '-m', 'Auto-commit'], {
            cwd: config.mediaServer.basePath
        });
    }
    catch (error) { }
    cmd.log('Pull remote changes into the local media repository.');
    await cmd.exec(['git', 'pull'], { cwd: config.mediaServer.basePath });
    cmd.log('Push local changes into the remote media repository.');
    await cmd.exec(['git', 'push'], { cwd: config.mediaServer.basePath });
    cmd.log('Updating the local MongoDB database.');
    await cmd.exec(['curl', 'http://localhost/api/media/mgmt/update']);
    cmd.stopSpin();
}
