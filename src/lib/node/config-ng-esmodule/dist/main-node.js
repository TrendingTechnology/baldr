import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let config;
/**
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
 */
export function getConfig() {
    if (config == null) {
        const configFile = path.join(path.sep, 'etc', 'baldr.json');
        if (fs.existsSync(configFile)) {
            config = require(configFile);
        }
        if (config == null) {
            throw new Error(`No configuration file found: ${configFile}`);
        }
        return config;
    }
    return config;
}
