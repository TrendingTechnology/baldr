import path from 'path';
import { getConfig } from '@bldr/config';
import { readYamlFile } from '@bldr/file-reader-writer';
const config = getConfig();
/**
 * Base class to be extended.
 */
export class Builder {
    constructor(filePath) {
        this.absPath = path.resolve(filePath);
    }
    get relPath() {
        return this.absPath
            .replace(config.mediaServer.basePath, '')
            .replace(/^\//, '');
    }
    importYamlFile(filePath, target) {
        const data = readYamlFile(filePath);
        for (const property in data) {
            target[property] = data[property];
        }
        return this;
    }
}
