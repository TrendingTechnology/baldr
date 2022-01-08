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
export function buildElectronBuilderConfig (
  appName: string
): Record<string, any> {
  appName = `baldr-${appName}`
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
      asar: true,
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
  }
}
