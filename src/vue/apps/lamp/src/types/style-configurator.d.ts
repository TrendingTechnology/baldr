// TODO Move this type defintions to the packages
import { StyleConfigurator } from '@baldr/style-configurator'
import type { LampTypes } from '@bldr/type-definitions'

interface Style {
  /**
   * Reset all styles to the default values.
   */
  reset: () => void
  set(styleConfig: LampTypes.StyleConfig): void
  toggleDarkMode(): void
  toggleCenterVertically(): void
  setContentTheme(themeName: string): void
  setUiTheme(themeName: string): void

  /**
   * @see https://fullscreen.spec.whatwg.org/#dom-document-fullscreen
   */
  toggleFullscreen(): void
}

declare module 'vue/types/vue' {
  interface Vue {
    $style: Style
  }

  interface VueConstructor {
    $style: Style
  }
}
