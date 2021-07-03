/**
 * Open files and path in the shell, the file manager etc (using child_process.spawn)
 *
 * @module @bldr/open-with
 */
import type { StringIndexedObject } from '@bldr/type-definitions';
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
export declare function openWith(executable: string, filePath: string): void;
/**
 * Open a file path using using the in `config.mediaServer.fileManager`
 * specified file manager.
 *
 * @param currentPath - The current path that should be opened in the file
 *   manager.
 * @param create - Create the directory structure of the given `currentPath` in
 *   a recursive manner.
 */
export declare function openWithFileManager(currentPath: string, create: boolean): StringIndexedObject;
