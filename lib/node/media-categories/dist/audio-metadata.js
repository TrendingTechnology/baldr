/**
 * Cache the audio metadata.
 *
 * @module @bldr/media-categories/audio-metadata
 */
import { collectAudioMetadata } from '@bldr/audio-metadata';
const cache = {};
async function getAudioMetadata(filePath) {
    if (cache[filePath] == null) {
        return await collectAudioMetadata(filePath);
    }
    return cache[filePath];
}
export async function getAudioMetadataValue(fieldName, filePath) {
    if (filePath != null) {
        const metadata = await getAudioMetadata(filePath);
        if (metadata?.[fieldName] != null) {
            return metadata[fieldName];
        }
    }
}
