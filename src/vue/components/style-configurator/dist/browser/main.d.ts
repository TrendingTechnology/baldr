import type { LampTypes } from '@bldr/type-definitions';
import _Vue from 'vue';
/**
 * @TODO Document the types here
 * Type defintions are in src/vue/apps/lamp/src/types/style-configurator.d.ts
 */
export declare class StyleConfigurator {
    private readonly setterCollection;
    reset(): void;
    set(styleConfig: LampTypes.StyleConfig): void;
    toggleDarkMode(): void;
    toggleCenterVertically(): void;
    toggleFullscreen: () => void;
    setContentTheme(themeName: string): void;
    setUiTheme(themeName: string): void;
}
declare const _default: {
    install(Vue: typeof _Vue, options?: any): void;
};
export default _default;
