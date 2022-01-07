import { Configuration as ConfigurationType } from './types';
export declare type Configuration = ConfigurationType;
/**
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
 */
export declare function getConfig(): Configuration;
export declare const joinPath: (...paths: string[]) => string;
export declare function getMediaPath(...relPath: string[]): string;
