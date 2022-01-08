import { validateDefintion } from '../../main.js';
export default validateDefintion({
    command: 'video-cut <video-file> <time-1> [time-2]',
    alias: 'vc',
    description: 'Cut a video file without reencoding using MP4box: ' +
        'If [time-2] is not specified, <time-1> is the end time. ' +
        'Possible time formats: Seconds as integers or strings ' +
        'in the format mm:ss oder hh:mm:ss.' +
        'Leading zeros can be omitted. ' +
        '-splitx StartTime:EndTime: extracts a subfile from the input file.' +
        'StartTime and EndTime are specified in seconds.' +
        'Depending on random access distribution in the file (sync samples), ' +
        'the startTime will be adjusted to the previous random access ' +
        'time in the file.',
    checkExecutable: [
        'MP4Box'
    ]
});
