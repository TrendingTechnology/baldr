/**
 * Cache the audio metadata.
 *
 * @module @bldr/media-categories/audio-metadata
 */
import { AudioMetadataContainer } from '@bldr/audio-metadata';
export declare function getAudioMetadataValue(fieldName: keyof AudioMetadataContainer, filePath?: string): Promise<string | number | undefined>;
