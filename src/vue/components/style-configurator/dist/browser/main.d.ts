/* eslint-disable */

import type { MasterTypes } from '@bldr/type-definitions';
import _Vue from 'vue';
declare module 'vue/types/vue' {
    interface Vue {
        /**
         * Global attribute for DynamicSelect
         */
        $style: StyleConfigurator;
    }
    interface VueConstructor {
        /**
         * Global attribute for DynamicSelect
         */
        $style: StyleConfigurator;
    }
}
declare class StyleConfigurator {
    private readonly setterCollection;
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
