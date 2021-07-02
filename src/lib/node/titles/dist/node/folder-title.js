"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderTitle = void 0;
const config_1 = __importDefault(require("@bldr/config"));
class FolderTitle {
    /**
     * @param data - Some meta data about the folder.
     */
    constructor({ title, subtitle, folderName, relPath, hasPraesentation, level }) {
        this.title = title;
        if (subtitle != null) {
            this.subtitle = subtitle;
        }
        this.folderName = folderName;
        relPath = relPath.replace(config_1.default.mediaServer.basePath, '');
        relPath = relPath.replace(/^\//, '');
        this.relPath = relPath;
        this.hasPraesentation = hasPraesentation;
        this.level = level;
    }
}
exports.FolderTitle = FolderTitle;
