"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderTitle = void 0;
const config_1 = require("@bldr/config");
const config = (0, config_1.getConfig)();
class FolderTitle {
    /**
     * @param data - Some meta data about the folder.
     */
    constructor({ title, subtitle, folderName, relPath, hasPresentation, level }) {
        this.title = title;
        if (subtitle != null) {
            this.subtitle = subtitle;
        }
        this.folderName = folderName;
        relPath = relPath.replace(config.mediaServer.basePath, '');
        relPath = relPath.replace(/^\//, '');
        this.relPath = relPath;
        this.hasPresentation = hasPresentation;
        this.level = level;
    }
}
exports.FolderTitle = FolderTitle;
