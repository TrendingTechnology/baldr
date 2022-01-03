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
    mainProcessFile: 'src/lib/electron-background',
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
  }
}
