import { StyleConfigurator } from '@baldr/style-configurator'

interface Style {
  /**
   * Reset all styles to the default values.
   */
  reset: () => void
}

// class StyleConfigurator {
//   private readonly setterCollection;
//   /**
//    * Reset all styles to the default values.
//    */
//   reset(): void;
//   set(styleConfig: MasterTypes.StyleConfig): void;
//   toggleDarkMode(): void;
//   toggleCenterVertically(): void;
//   setContentTheme(themeName: string): void;
//   setUiTheme(themeName: string): void;
// }

declare module 'vue/types/vue' {
  interface Vue {
    $style: Style
  }

  interface VueConstructor {
    $style: Style
  }
}
