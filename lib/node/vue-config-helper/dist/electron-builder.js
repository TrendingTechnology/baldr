"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildElectronBuilderConfig = void 0;
/**
 * ```js
 * pluginOptions: {
 *   electronBuilder: {
 *     preload: 'src/preload.js',
 *     mainProcessFile: 'src/lib/electron-background',
 *     // nodeIntegration: true,
 *     builderOptions: {
 *       appId: 'rocks.friedrich.baldr',
 *       productName: 'baldr-lamp',
 *       asar: true,
 *       linux: {
 *         target: 'deb',
 *         category: 'Education',
 *         executableName: 'baldr-lamp',
 *         icon: './icon.svg'
 *       },
 *       extraMetadata: {
 *         name: 'baldr-lamp'
 *       }
 *     }
 *   }
 * }
 * ```
 */
function buildElectronBuilderConfig(appName) {
    appName = `baldr-${appName}`;
    return {
        preload: 'src/preload.js',
        mainProcessFile: 'src/background.js',
        /**
         * Manually disable typescript plugin for main process. Enable if you want
         * to use regular js for the main process (src/background.js by default).
         */
        // disableMainProcessTypescript: false,
        /**
         * Manually enable type checking during webpack bundling for background file.
         */
        // mainProcessTypeChecking: true,
        // nodeIntegration: true,
        builderOptions: {
            appId: 'rocks.friedrich.baldr',
            productName: appName,
            asar: false,
            linux: {
                target: 'deb',
                category: 'Education',
                executableName: appName,
                icon: './icon.svg'
            },
            extraMetadata: {
                name: appName
            }
        }
    };
}
exports.buildElectronBuilderConfig = buildElectronBuilderConfig;
