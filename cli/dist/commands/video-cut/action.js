// Project packages.
import { CommandRunner } from '@bldr/cli-utils';
import { convertHHMMSSToSeconds } from '@bldr/string-format';
export default async function action(videoFilePath, time1, time2) {
    const cmd = new CommandRunner({ verbose: true });
    let startSec = 0;
    let endSec;
    if (time2 == null) {
        endSec = convertHHMMSSToSeconds(time1);
    }
    else {
        startSec = convertHHMMSSToSeconds(time1);
        endSec = convertHHMMSSToSeconds(time2);
    }
    cmd.startSpin();
    await cmd.exec([
        'MP4Box',
        '-splitx',
        `${startSec}:${endSec}`,
        '"' + videoFilePath + '"'
    ]);
    cmd.stopSpin();
}
