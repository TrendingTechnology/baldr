interface FolderTitleSpec {
    /**
     * The title. It is the first line in the file `titles.txt`.
     */
    title: string;
    /**
     * The subtitle. It is the second line in the file `titles.txt`.
     */
    subtitle?: string;
    /**
     * The name of the parent folder, for example `10_Konzertierende-Musiker`
     */
    folderName: string;
    /**
     * The relative path of the folder inside the base path, for example
     * `12/10_Interpreten/10_Konzertierende-Musiker`.
     */
    relPath: string;
    /**
     * True if the folder contains a file with the file name
     * `Praesentation.baldr.yml`
     */
    hasPraesentation: boolean;
    /**
     * The level in a folder title tree, starting with 1. 1 ist the top level.
     */
    level?: number;
}
/**
 * Hold some meta data about a folder and its title.
 */
export declare class FolderTitle {
    /**
     * The title. It is the first line in the file `titles.txt`.
     */
    title: string;
    /**
     * The subtitle. It is the second line in the file `titles.txt`.
     */
    subtitle?: string;
    /**
     * The name of the parent folder, for example `10_Konzertierende-Musiker`
     */
    folderName: string;
    /**
     * The relative path of the folder inside the base path, for example
     * `12/10_Interpreten/10_Konzertierende-Musiker`.
     */
    relPath: string;
    /**
     * True if the folder contains a file with the file name
     * `Praesentation.baldr.yml`
     */
    hasPraesentation: boolean;
    /**
     * The level in a folder title tree, starting with 1. 1 ist the top level.
     */
    level?: number;
    /**
     * @param data - Some meta data about the folder.
     */
    constructor({ title, subtitle, folderName, relPath, hasPraesentation, level }: FolderTitleSpec);
}
export {};
