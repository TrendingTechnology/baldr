"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetBuilder = void 0;
const fs_1 = __importDefault(require("fs"));
const string_format_1 = require("@bldr/string-format");
const client_media_models_1 = require("@bldr/client-media-models");
const builder_1 = require("./builder");
/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
class AssetBuilder extends builder_1.Builder {
    /**
     * @param filePath - The file path of the media file.
     */
    constructor(filePath) {
        super(filePath);
        this.data = {
            relPath: this.relPath
        };
    }
    detectPreview() {
        if (fs_1.default.existsSync(`${this.absPath}_preview.jpg`)) {
            this.data.hasPreview = true;
        }
        return this;
    }
    detectWaveform() {
        if (fs_1.default.existsSync(`${this.absPath}_waveform.png`)) {
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
            const extension = (0, string_format_1.getExtension)(this.absPath);
            basePath = this.absPath.replace(`.${extension}`, '');
            return `${basePath}${suffix}.${extension}`;
        };
        let count = 2;
        while (fs_1.default.existsSync(nextAssetFileName(count))) {
            count += 1;
        }
        count -= 1; // The counter is increased before the file system check.
        if (count > 1) {
            this.data.multiPartCount = count;
        }
        return this;
    }
    detectMimeType() {
        const extension = (0, string_format_1.getExtension)(this.absPath);
        this.data.mimeType = client_media_models_1.mimeTypeManager.extensionToType(extension);
        return this;
    }
    buildAll() {
        this.importYamlFile(`${this.absPath}.yml`, this.data);
        this.detectPreview();
        this.detectWaveform();
        this.detectMultiparts();
        this.detectMimeType();
        return this;
    }
    export() {
        return this.data;
    }
}
exports.AssetBuilder = AssetBuilder;
