import { Configuration as ConfigurationType } from './types';
export declare type Configuration = ConfigurationType;
/**
 * Re-exports the global config object.
 */
export declare function getConfig(): Configuration;
/**
 * A simple analog of Node.js's `path.join(...)`.
 * https://gist.github.com/creationix/7435851#gistcomment-3698888
 */
export declare function joinPath(...segments: string[]): string;
export declare function getMediaPath(...relPath: string[]): string;
