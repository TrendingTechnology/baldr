import fs from 'fs';
import path from 'path';
// Project packages.
import { categoriesManagement, categories } from '@bldr/media-categories';
import { query, fetchCommonsFile } from '@bldr/wikidata';
import { writeYamlFile } from '@bldr/file-reader-writer';
import * as log from '@bldr/log';
import { getConfig } from '@bldr/config';
const config = getConfig();
/**
 * @param category - For example `group`, `instrument`, `person`,
 *   `song`
 * @param itemId - For example `Q123`
 */
export default async function action(category, itemId, arg1, arg2, cmdObj) {
    const rawData = await query(itemId, category, categories);
    if (arg1 != null) {
        if (category === 'person') {
            rawData.firstname = arg1;
            rawData.lastname = arg2;
        }
    }
    rawData.categories = category;
    const data = await categoriesManagement.process(rawData);
    log.infoAny(data);
    let downloadWikicommons = true;
    if (rawData?.mainImage == null) {
        data.mainImage = 'blank.jpg';
        downloadWikicommons = false;
    }
    const dest = categoriesManagement.formatFilePath(data);
    if (dest == null)
        return;
    if (downloadWikicommons) {
        if (!cmdObj.dryRun && data.mainImage != null) {
            await fetchCommonsFile(data.mainImage, dest);
        }
        else {
            log.info('Dry run! Destination: %s', [dest]);
        }
    }
    if (!cmdObj.dryRun && !fs.existsSync(dest)) {
        const src = path.join(config.localRepo, 'src', 'cli', 'src', 'blank.jpg');
        log.info(src);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        log.info('No Wikicommons file. Use temporary blank file instead.');
    }
    const yamlFile = `${dest}.yml`;
    if (!fs.existsSync(yamlFile)) {
        if (!cmdObj.dryRun) {
            log.info('Write YAML file: %s', [yamlFile]);
            writeYamlFile(yamlFile, data);
        }
    }
    else {
        log.info('The YAML file already exists: %s', [yamlFile]);
    }
}
