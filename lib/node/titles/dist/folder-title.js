import { getConfig } from '@bldr/config';
const config = getConfig();
export class FolderTitle {
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
