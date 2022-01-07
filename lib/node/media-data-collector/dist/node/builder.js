"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const path_1 = __importDefault(require("path"));
const config_1 = require("@bldr/config");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const config = (0, config_1.getConfig)();
/**
 * Base class to be extended.
 */
class Builder {
    constructor(filePath) {
        this.absPath = path_1.default.resolve(filePath);
    }
    get relPath() {
        return this.absPath
            .replace(config.mediaServer.basePath, '')
            .replace(/^\//, '');
    }
    importYamlFile(filePath, target) {
        const data = (0, file_reader_writer_1.readYamlFile)(filePath);
        for (const property in data) {
            target[property] = data[property];
        }
        return this;
    }
}
exports.Builder = Builder;
