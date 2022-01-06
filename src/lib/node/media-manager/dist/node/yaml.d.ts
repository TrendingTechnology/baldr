import { MediaDataTypes, StringIndexedObject } from '@bldr/type-definitions';
/**
 * Load the metadata file in the YAML format of a media asset. This
 * function appends `.yml` on the file path. It is a small wrapper
 * around `readYamlFile`.
 *
 * @param filePath - The path of a media asset without the `yml`
 * extension. For example `Fuer-Elise.mp3` not `Fuer-Elise.mp3.yml`.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted in the `camleCase` format.
 */
export declare function readYamlMetaData(filePath: string): StringIndexedObject;
/**
 * Write the metadata YAML file for a corresponding media file specified
 * by `filePath`. The property names are converted to `snake_case`.
 *
 * @param filePath - The filePath gets asciified and a yml extension is
 *   appended.
 * @param metaData - The metadata to store in the YAML file.
 * @param force - Always create the yaml file. Overwrite the old one.
 */
export declare function writeYamlMetaData(filePath: string, metaData?: MediaDataTypes.AssetMetaData, force?: boolean): Promise<object | undefined>;
