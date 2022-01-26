/**
 * ```js
 * pluginOptions: {
 *   electronBuilder: {
 *     preload: 'src/preload.js',
 *     mainProcessFile: 'src/lib/electron-background',
 *     // nodeIntegration: true,
 *     builderOptions: {
 *       appId: 'rocks.friedrich.baldr',
 *       productName: 'baldr-presentation',
 *       asar: true,
 *       linux: {
 *         target: 'deb',
 *         category: 'Education',
 *         executableName: 'baldr-presentation',
 *         icon: './icon.svg'
 *       },
 *       extraMetadata: {
 *         name: 'baldr-presentation'
 *       }
 *     }
 *   }
 * }
 * ```
 */
export declare function buildElectronBuilderConfig(appName: string): Record<string, any>;
