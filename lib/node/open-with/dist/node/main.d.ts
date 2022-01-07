/**
 * Open files and path in the shell, the file manager etc (using child_process.spawn)
 *
 * @module @bldr/open-with
 */
/// <reference types="node" />
import childProcess from 'child_process';
/**
 * Open a file path with an executable.
 *
 * To launch apps via the REST API the systemd unit file must run as
 * the user you logged in to your desktop environment. You also have to set
 * to environment variables: `DISPLAY=:0` and
 * `DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$UID/bus`
 *
 * ```
 * Environment=DISPLAY=:0
 * Environment=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
 * User=1000
 * Group=1000
 * ```
 *
 * @param executable - Name or path of an executable.
 * @param filePath - The path of a file or a folder.
 *
 * @see node module on npmjs.org “open”
 * @see {@link https://unix.stackexchange.com/a/537848}
 */
export declare function openWith(executable: string, filePath: string): childProcess.ChildProcess;
interface OpenInFileManagerResult {
    fileManager: string;
    filePath: string;
    parentDir: string;
    process?: childProcess.ChildProcess;
    opened: boolean;
    createdParentDir: boolean;
}
/**
 * Open a file path or multiple file paths with the in
 * `config.mediaServer.fileManager` specified file manager.
 *
 * @param filePaths - The file paths that should be opened in the file manager.
 * @param createParentDir - Create the directory structure of the given
 *   `filePath` in a recursive manner.
 */
export declare function openInFileManager(filePaths: string | string[], createParentDir?: boolean): OpenInFileManagerResult[];
export {};
