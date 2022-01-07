/**
 * Walk through a tree of files and directories.
 *
 * @module @bldr/media-manager/directory-tree-walk
 */
/**
 * A function which is called during the directory structure walk.
 */
declare type WalkFunction = (path: string, payload?: object | any) => any;
/**
 * A collection of walk functions.
 */
interface WalkFunctionBundle {
    /**
     * This function is called on every presentation.
     */
    presentation?: WalkFunction;
    /**
     * This function is called on every asset.
     */
    asset?: WalkFunction;
    /**
     * This function is called on every TeX file.
     */
    tex?: WalkFunction;
    /**
     * This function is called on all media
     * types, at the moment on presentations and assets.
     */
    all?: WalkFunction;
    /**
     * This function is called on every file.
     */
    everyFile?: WalkFunction;
    /**
     * This function is called on directories.
     */
    directory?: WalkFunction;
}
/**
 * A collection of options for the walk function.
 */
interface WalkOption {
    /**
     * The function/s is/are called with with this payload. Multiple
     * arguments have to be bundled as a single object.
     */
    payload?: any;
    /**
     * An array of directory or file paths or a single path. If this
     * property is not set, the current working directory is used.
     */
    path?: string | string[];
    /**
     * If this property is set, `func` have to be a single function. Each
     * resolved file path must match this regular expression to execute
     * the function. If you have specified a string, this string is
     * converted into the regular expression `*.ext`.
     */
    regex?: string | RegExp;
    extension?: string;
    /**
     * Descend at most levels (a non-negative integer) levels of directories
     * below the starting-pointq.
     */
    maxDepths?: number;
}
/**
 * Execute a function on one file or walk trough all files matching a
 * regex in the current working directory or in the given directory
 * path.
 *
 * @param walkFunction - A single function or an object containing functions.
 */
export declare function walk(walkFunction: WalkFunction | WalkFunctionBundle, opt?: WalkOption): Promise<void>;
export {};
