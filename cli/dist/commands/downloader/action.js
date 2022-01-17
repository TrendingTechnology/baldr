import { operations } from '@bldr/media-manager';
import { fetchFile } from '@bldr/node-utils';
/**
 * Download a media asset.
 *
 * @param url - The source URL.
 * @param id - The ID of the destination file.
 * @param extension - The extension of the destination file.
 */
export default async function action(url, id, extension) {
    if (extension == null) {
        extension = url.substring(url.lastIndexOf('.') + 1);
    }
    if (id == null) {
        id = url.substring(url.lastIndexOf('/') + 1);
        id = id.replace(/\.\w+$/, '');
    }
    const destFile = `${id}.${extension}`;
    await fetchFile(url, destFile);
    // Make images smaller.
    const convertedDestFile = await operations.convertAsset(destFile);
    if (convertedDestFile != null) {
        const metaData = { source: url };
        const meta = metaData;
        await operations.initializeMetaYaml(destFile, meta);
    }
}
