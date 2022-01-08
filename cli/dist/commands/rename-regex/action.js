import fs from 'fs';
// Project packages.
import { walk } from '@bldr/media-manager';
import * as log from '@bldr/log';
function renameByRegex(filePath, { pattern, replacement }) {
    const newFilePath = filePath.replace(pattern, replacement);
    if (filePath !== newFilePath) {
        log.info('\nRename:\n  old: %s \n  new: %s', [filePath, newFilePath]);
        fs.renameSync(filePath, newFilePath);
    }
}
export default async function action(pattern, replacement, filePath) {
    await walk(renameByRegex, {
        regex: /.*/,
        path: filePath,
        payload: { pattern, replacement }
    });
}
