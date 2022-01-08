import fs from 'fs';
import { getExtension } from '@bldr/string-format';
import { mimeTypeManager } from '@bldr/client-media-models';
import { Builder } from './builder';
/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
export class AssetBuilder extends Builder {
    /**
     * @param filePath - The file path of the media file.
     */
    constructor(filePath) {
        super(filePath);
        this.data = {
            path: this.relPath
        };
    }
    detectPreview() {
        if (fs.existsSync(`${this.absPath}_preview.jpg`)) {
            this.data.hasPreview = true;
        }
        return this;
    }
    detectWaveform() {
        if (fs.existsSync(`${this.absPath}_waveform.png`)) {
            this.data.hasWaveform = true;
        }
        return this;
    }
    /**
     * Search for mutlipart assets. The naming scheme of multipart assets is:
     * `filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`
     */
    detectMultiparts() {
        const nextAssetFileName = (count) => {
            let suffix;
            if (count < 10) {
                suffix = `_no00${count}`;
            }
            else if (count < 100) {
                suffix = `_no0${count}`;
            }
            else if (count < 1000) {
                suffix = `_no${count}`;
            }
            else {
                throw new Error(`${this.absPath} multipart asset counts greater than 100 are not supported.`);
            }
            let basePath = this.absPath;
            const extension = getExtension(this.absPath);
            basePath = this.absPath.replace(`.${extension}`, '');
            return `${basePath}${suffix}.${extension}`;
        };
        let count = 2;
        while (fs.existsSync(nextAssetFileName(count))) {
            count += 1;
        }
        count -= 1; // The counter is increased before the file system check.
        if (count > 1) {
            this.data.multiPartCount = count;
        }
        return this;
    }
    detectMimeType() {
        const extension = getExtension(this.absPath);
        this.data.mimeType = mimeTypeManager.extensionToType(extension);
        return this;
    }
    buildMinimal() {
        const data = {};
        this.importYamlFile(`${this.absPath}.yml`, data);
        return data;
    }
    buildForDb() {
        this.importYamlFile(`${this.absPath}.yml`, this.data);
        this.detectPreview();
        this.detectWaveform();
        this.detectMultiparts();
        this.detectMimeType();
        if (this.data.ref == null ||
            this.data.uuid == null ||
            this.data.title == null) {
            throw new Error('The asset YAML file must have the properties “ref”, “uuid”, “title”');
        }
        return this.data;
    }
}
