"use strict";
/**
 * @module @bldr/media-manager/location-indicator
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationIndicator = void 0;
// Node packages.
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Project packages.
const config_1 = __importDefault(require("@bldr/config"));
const core_node_1 = require("@bldr/core-node");
/**
 * Indicates in which folder structure a file is located.
 *
 * Merge the configurations entries of `config.mediaServer.basePath` and
 * `config.mediaServer.archivePaths`. Store only the accessible ones.
 */
class LocationIndicator {
    constructor() {
        this.main = config_1.default.mediaServer.basePath;
        const basePaths = [
            config_1.default.mediaServer.basePath,
            ...config_1.default.mediaServer.archivePaths
        ];
        this.basePaths = [];
        for (let i = 0; i < basePaths.length; i++) {
            basePaths[i] = path_1.default.resolve(core_node_1.untildify(basePaths[i]));
            if (fs_1.default.existsSync(basePaths[i])) {
                this.basePaths.push(basePaths[i]);
            }
        }
    }
    /**
     * Check if the `currentPath` is inside a archive folder structure and
     * not in den main media folder.
     */
    isInArchive(currentPath) {
        if (path_1.default.resolve(currentPath).includes(this.main)) {
            return false;
        }
        return true;
    }
    /**
     * Get the directory where a presentation file (Praesentation.baldr.yml) is
     * located in (The first folder with a prefix like `10_`)
     *
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Material/Duke-Ellington.jpg` ->
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing`
     */
    getPresParentDir(currentPath) {
        const parentFile = core_node_1.findParentFile(currentPath, 'Praesentation.baldr.yml');
        if (parentFile != null) {
            return path_1.default.dirname(parentFile);
        }
    }
    /**
     * Move a file path into a directory relative to the current
     * presentation directory.
     *
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/NB/Duke-Ellington.jpg` `BD` ->
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/BD/Duke-Ellington.jpg`
     *
     * @param currentPath - The current path.
     * @param subDir - A relative path.
     */
    moveIntoSubdir(currentPath, subDir) {
        const fileName = path_1.default.basename(currentPath);
        const presPath = this.getPresParentDir(currentPath);
        if (presPath == null) {
            throw new Error('The parent presentation folder couldn’t be detected!');
        }
        return path_1.default.join(presPath, subDir, fileName);
    }
    /**
     * A deactivaed directory is a directory which has no direct counter part in
     * the main media folder, which is not mirrored. It is a real archived folder
     * in the archive folder. Activated folders have a prefix like `10_`
     *
     * true:
     *
     * - `/archive/10/10_Jazz/30_Stile/10_New-Orleans-Dixieland/Material/Texte.tex`
     * - `/archive/10/10_Jazz/History-of-Jazz/Inhalt.tex`
     * - `/archive/12/20_Tradition/30_Volksmusik/Bartok/10_Tanzsuite/Gliederung.tex`
     *
     * false:
     *
     * `/archive/10/10_Jazz/20_Vorformen/10_Worksongs-Spirtuals/Arbeitsblatt.tex`
     */
    isInDeactivatedDir(currentPath) {
        currentPath = path_1.default.dirname(currentPath);
        const relPath = this.getRelPath(currentPath);
        if (relPath == null)
            return true;
        const segments = relPath.split(path_1.default.sep);
        for (const segment of segments) {
            if (segment.match(/^\d\d/) == null) {
                return true;
            }
        }
        return false;
    }
    /**
     * Get the path relative to one of the base paths and `currentPath`.
     *
     * @param currentPath - The path of a file or a directory inside
     *   a media server folder structure or inside its archive folders.
     */
    getRelPath(currentPath) {
        currentPath = path_1.default.resolve(currentPath);
        let relPath;
        for (const basePath of this.basePaths) {
            if (currentPath.indexOf(basePath) === 0) {
                relPath = currentPath.replace(basePath, '');
                break;
            }
        }
        if (relPath !== undefined) {
            return relPath.replace(new RegExp(`^${path_1.default.sep}`), '');
        }
    }
    /**
     * Get the path relative to one of the base paths and `currentPath`.
     *
     * @param currentPath - The path of a file or a directory inside
     *   a media server folder structure or inside its archive folders.
     */
    getBasePath(currentPath) {
        currentPath = path_1.default.resolve(currentPath);
        let basePath;
        for (const bPath of this.basePaths) {
            if (currentPath.indexOf(bPath) === 0) {
                basePath = bPath;
                break;
            }
        }
        if (basePath !== undefined) {
            return basePath.replace(new RegExp(`${path_1.default.sep}$`), '');
        }
    }
    /**
     * The mirrored path of the current give file path, for example:
     *
     * This folder in the main media folder structure
     *
     * `/var/data/baldr/media/12/10_Interpreten/20_Auffuehrungspraxis/20_Instrumentenbau/TX`
     *
     * gets converted to
     *
     * `/mnt/xpsschulearchiv/12/10_Interpreten/20_Auffuehrungspraxis/20_Instrumentenbau`.
     *
     * @param currentPath - The path of a file or a directory inside
     *   a media server folder structure or inside its archive folders.
     */
    getMirroredPath(currentPath) {
        const basePath = this.getBasePath(currentPath);
        const relPath = this.getRelPath(currentPath);
        let mirroredBasePath;
        for (const bPath of this.basePaths) {
            if (basePath !== bPath) {
                mirroredBasePath = bPath;
                break;
            }
        }
        if (mirroredBasePath !== undefined && relPath !== undefined) {
            return path_1.default.join(mirroredBasePath, relPath);
        }
    }
}
exports.locationIndicator = new LocationIndicator();
exports.default = exports.locationIndicator;
