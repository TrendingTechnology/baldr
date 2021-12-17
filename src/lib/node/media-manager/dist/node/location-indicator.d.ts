/**
 * @module @bldr/media-manager/location-indicator
 */
/**
 * Indicates in which folder structure a file is located.
 *
 * Merge the configurations entries of `config.mediaServer.basePath` and
 * `config.mediaServer.archivePaths`. Store only the accessible ones.
 */
declare class LocationIndicator {
    /**
     * The base path of the main media folder.
     */
    main: string;
    /**
     * Multiple base paths of media collections (the main base path and some
     * archive base paths)
     */
    readonly basePaths: string[];
    constructor();
    /**
     * Check if the `currentPath` is inside a archive folder structure and
     * not in den main media folder.
     */
    isInArchive(currentPath: string): boolean;
    /**
     * A deactivated directory is a directory which has no direct counter part in
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
     * Get the parent directory in which a presentation file
     * (Praesentation.baldr.yml) is located. For example: Assuming this file
     * exists: `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Presentation.baldr.yml`
     *
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Material/Duke-Ellington.jpg` ->
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing`
     */
    getPresParentDir(currentPath: string): string | undefined;
    /**
     * Get the first parent directory (the first folder with a prefix like `10_`)
     * that has a two-digit numeric prefix.
     *
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing/Material/Duke-Ellington.jpg` ->
     * `/baldr/media/10/10_Jazz/30_Stile/20_Swing`
     */
    getTwoDigitPrefixedParentDir(currentPath: string): string | undefined;
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
     * Get the path relative to one of the base paths and `currentPath`.
     *
     * @param currentPath - The path of a file or a directory inside
     *   a media server folder structure or inside its archive folders.
     */
    getRelPath(currentPath: string): string | undefined;
    /**
     * Get the base path. If the base path and the relative path are combined,
     * the absolute path is created.
     *
     * @param currentPath - The path of a file or a directory inside
     *   a media server folder structure or inside its archive folders.
     */
    getBasePath(currentPath: string): string | undefined;
    /**
     * Create for each path segment of the relative path a reference (ref) string.
     *
     * This path
     *
     * `/var/data/baldr/media/12/10_Interpreten/20_Auffuehrungspraxis/20_Instrumentenbau/TX`
     *
     * is converted into
     *
     * ```js
     * ['12', 'Interpreten', 'Auffuehrungspraxis', 'Instrumentenbau', 'TX']
     * ```
     * @param currentPath - The path of a file or a directory inside
     *   a media server folder structure or inside its archive folders.
     */
    getRefOfSegments(currentPath: string): string[] | undefined;
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
    getMirroredPath(currentPath: string): string | undefined;
}
export declare const locationIndicator: LocationIndicator;
export {};
