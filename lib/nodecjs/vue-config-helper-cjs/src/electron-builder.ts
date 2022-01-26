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
export function buildElectronBuilderConfig (
  appName: string
): Record<string, any> {
  appName = `baldr-${appName}`
  return {
    preload: 'src/preload.js',
    mainProcessFile: 'src/background.js',

    /**
     * If you don't want your files outputted into dist_electron, you can choose
     * a custom folder in VCPEB's plugin options. You can use the --dest
     * argument to change the output dir as well.
     */
    outputDir: `/opt/${appName}`,

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
        target: 'deb', // deb / dir
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
