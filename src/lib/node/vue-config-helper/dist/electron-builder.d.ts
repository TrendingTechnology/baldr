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
export declare function buildElectronBuilderConfig(appName: string): {
    preload: string;
    mainProcessFile: string;
    builderOptions: {
        appId: string;
        productName: string;
        asar: boolean;
        linux: {
            target: string;
            category: string;
            executableName: string;
            icon: string;
        };
        extraMetadata: {
            name: string;
        };
    };
};
