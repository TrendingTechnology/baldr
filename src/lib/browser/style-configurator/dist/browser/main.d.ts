import type { LampTypes } from '@bldr/type-definitions';
export declare class StyleConfigurator {
    private readonly setterCollection;
    constructor();
    reset(): void;
    set(styleConfig: LampTypes.StyleConfig): void;
    toggleDarkMode(): void;
    toggleCenterVertically(): void;
    toggleFullscreen: () => void;
    setContentTheme(themeName: string): void;
    setUiTheme(themeName: string): void;
}
export declare const styleConfigurator: StyleConfigurator;
