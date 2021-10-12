/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
import { MediaResolverTypes } from '@bldr/type-definitions';
export * from './operations';
export * from './directory-tree-walk';
export * from './location-indicator';
export * from './media-file-classes';
export * from './yaml';
export declare function setLogLevel(level: number): void;
/**
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
export declare function readAssetYaml(filePath: string): MediaResolverTypes.YamlFormat | undefined;
