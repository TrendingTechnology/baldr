/**
 * @module @bldr/icon-font-generator
 */
import { Configuration } from '@bldr/config';
import * as log from '@bldr/log';
/**
 * For the tests. To see whats going on. The test runs very long.
 */
export declare const setLogLevel: typeof log.setLogLevel;
export declare function createIconFont(config: Configuration, tmpDir: string): Promise<void>;
declare function action(): Promise<void>;
export default action;
