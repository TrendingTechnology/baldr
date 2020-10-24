/**
 * @module @bldr/media-manager/location-indicator
 */
/**
 * Indicate where a file is located in the media folder structure.
 *
 * Merge the configurations entries of `config.mediaServer.basePath` and
 * `config.mediaServer.archivePaths`. Store only the accessible ones.
 */
declare class LocationIndicator {
    main: string;
    private paths;
    constructor();
    /**
     * Check if the `currentPath` is inside a archive folder structure and
     * not in den main media folder.
     */
    isInArchive(currentPath: string): boolean;
    /**
     * Get the directory where a presentation file (Praesentation.baldr.yml) is
     * located in (The first folder with a prefix like `10_`)
     *
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Material/Duke-Ellington.jpg` ->
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing`
     */
    getPresParentDir(currentPath: string): string;
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
    moveIntoSubdir(currentPath: string, subDir: string): string;
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
    isInDeactivatedDir(currentPath: string): boolean;
    /**
     * @returns An array of directory paths in this order: First the main
     *   base path of the media server, then one ore more archive
     *   directory paths. The paths are checked for existence and resolved
     *   (untildified).
     */
    get(): string[];
    /**
     * Get the path relative to one of the base paths and `currentPath`.
     *
     * @param currentPath - The path of a file or a directory inside
     *   a media server folder structure or inside its archive folders.
     */
    getRelPath(currentPath: string): string;
    /**
     * Get the path relative to one of the base paths and `currentPath`.
     *
     * @param currentPath - The path of a file or a directory inside
     *   a media server folder structure or inside its archive folders.
     */
    getBasePath(currentPath: string): string;
    /**
     * @param currentPath - The path of a file or a directory inside
     *   a media server folder structure or inside its archive folders.
     */
    getMirroredPath(currentPath: string): string;
}
declare const _default: LocationIndicator;
export default _default;
