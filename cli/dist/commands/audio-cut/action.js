// Project packages.
import { CommandRunner } from '@bldr/cli-utils';
export default async function action(filePath) {
    const cmd = new CommandRunner({
        verbose: true
    });
    cmd.startSpin();
    await cmd.exec([
        'ffmpeg',
        '-i',
        filePath,
        '-to',
        '120',
        '-af',
        'afade=t=out:st=110:d=10',
        '-map_metadata',
        '-1',
        `${filePath}_cut.mp3`
    ]);
}
