import childProcess from 'child_process';
import { getExtension } from '@bldr/string-format';
export default function action(filePath) {
    // Musicassette-9-10_1991.pdf.yml -> Musicassette-9-10_1991.pdf
    filePath = filePath.replace(/\.yml$/, '');
    let command;
    let args;
    const extension = getExtension(filePath);
    if (extension === 'jpg' || extension === 'png') {
        command = 'gimp';
        args = [filePath];
    }
    else {
        // setsid: run a program in a new session
        command = 'setsid';
        args = ['--wait', 'gio', 'open', filePath];
    }
    const subprocess = childProcess.spawn(command, args, {
        stdio: 'ignore',
        detached: true
    });
    subprocess.unref();
}
