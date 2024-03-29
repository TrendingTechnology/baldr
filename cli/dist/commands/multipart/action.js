import fs from 'fs';
import glob from 'glob';
// Project packages.
import { formatMultiPartAssetFileName, getExtension } from '@bldr/string-format';
import { writeYamlMetaData, operations } from '@bldr/media-manager';
import * as log from '@bldr/log';
/**
 * Rename multipart assets. Example “b mp "*.jpg" Systeme”
 *
 * @param globPattern - For example `*.jpg`
 * @param prefix - For example `Systeme`
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
export default async function action(globPattern, prefix, cmdObj) {
    const files = glob.sync(globPattern);
    if (files.length < 1) {
        log.info('Glob matches no files.');
        return;
    }
    files.sort(undefined);
    let no = 1;
    const extension = getExtension(files[0]);
    if (extension == null)
        throw Error('No extension');
    const firstNewFileName = `${prefix}.${extension}`;
    for (const oldFileName of files) {
        // Omit already existent info file by the renaming.
        if (oldFileName.match(/yml$/i) == null) {
            const newFileName = formatMultiPartAssetFileName(`${prefix}.${extension}`, no);
            log.info('%s -> %s', [oldFileName, newFileName]);
            if (!cmdObj.dryRun)
                fs.renameSync(oldFileName, newFileName);
            no += 1;
        }
    }
    if (fs.existsSync(firstNewFileName) && !cmdObj.dryRun) {
        await writeYamlMetaData(firstNewFileName);
        await operations.normalizeMediaAsset(firstNewFileName, { wikidata: false });
    }
}
