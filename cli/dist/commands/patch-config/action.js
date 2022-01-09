import { stripCategories, twoLetterAbbreviations } from '@bldr/media-categories';
import { readJsonFile, writeJsonFile } from '@bldr/file-reader-writer';
import * as log from '@bldr/log';
import { getConfig } from '@bldr/config';
import exportSass from '@bldr/sass-export';
const config = getConfig();
export default function action() {
    stripCategories();
    const configJson = readJsonFile(config.configurationFileLocations[1]);
    configJson.mediaCategories = stripCategories();
    configJson.twoLetterAbbreviations = twoLetterAbbreviations;
    configJson.sassVariables = exportSass();
    for (const filePath of config.configurationFileLocations) {
        log.info('Patch configuration file %s\n', [filePath]);
        log.info(writeJsonFile(filePath, configJson));
    }
}
