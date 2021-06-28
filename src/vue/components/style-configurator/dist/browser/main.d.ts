import type { MasterTypes } from '@bldr/type-definitions';
import _Vue from 'vue';
export declare class StyleConfigurator {
    private readonly setterCollection;
    /**
     * Reset all styles to the default values.
     */
    reset(): void;
    set(styleConfig: MasterTypes.StyleConfig): void;
    toggleDarkMode(): void;
    toggleCenterVertically(): void;
    setContentTheme(themeName: string): void;
    setUiTheme(themeName: string): void;
}
declare const _default: {
    install(Vue: typeof _Vue, options?: any): void;
};
export default _default;
