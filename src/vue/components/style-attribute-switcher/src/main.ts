import { MasterTypes } from '@bldr/type-definitions'

class AttributeSwitcher {
  attributeName: string
  state: boolean = true

  constructor (attributeName: string) {
    this.attributeName = attributeName
  }

  get stateAsString (): string {
    return `${this.state}`
  }

  set (state: boolean = false): void {
    this.state = state
  }

  toggle (): boolean {
    this.set(!this.state)
    return this.state
  }
}

/**
 * Set multiple attributes at the same time
 */
 class MultipleAttributesSwitcher extends AttributeSwitcher{
   attributeName: string
  constructor (attributeName: string) {
    super(attributeName)
  }

  set (state: boolean = false) {
    super.set(state)
    const elements = document.querySelectorAll(`[${this.attributeName}]`)
    for (const element of elements) {
      element.attributes[this.attributeName].value = this.stateAsString
    }
  }
}

class BodyAttributesSwitcher extends AttributeSwitcher {
  bodyElement: HTMLBodyElement
  constructor (attributeName: string) {
    super(attributeName)
    this.bodyElement = document.querySelector('body')
  }

  set (state: boolean = false) {
    super.set(state)
    this.bodyElement.setAttribute(this.attributeName, this.stateAsString)
  }
}

class DarkMode extends BodyAttributesSwitcher {
  constructor () {
    super('b-dark-mode')
    this.state = false
  }
}

class ContentTheme extends MultipleAttributesSwitcher {
  constructor () {
    super('b-content-theme')
  }

  set (state: boolean = false) {
    this.state = state
    const elements = document.querySelectorAll(`[${this.attributeName}]`)
    for (const element of elements) {
      // Preview slide editor has content-theme handwriting, which should
      // be unchangeable.
      if (!element.attributes['b-content-theme-unchangeable']) {
        element.attributes[this.attributeName].value = this.stateAsString
      }
    }
  }
}

class UiTheme extends MultipleAttributesSwitcher {
  constructor () {
    super('b-ui-theme')
  }
}


/**
 *
 */
class StyleConfigurator {
  constructor () {
    this.configObjects = {
      darkMode: new DarkMode(),
      contentTheme: new ContentTheme(),
      uiTheme: new UiTheme()
    }
  }

  /**
   * @private
   */
  defaults_ () {
    return {
      darkMode: false,
      contentTheme: 'default',
      uiTheme: 'default'
    }
  }

  setDefaults () {
    this.set_(this.defaults_())
  }

  /**
   * @private
   */
  set_ (styleConfig) {
    for (const config in styleConfig) {
      if (config in this.configObjects) {
        this.configObjects[config].set(styleConfig[config])
      } else {
        throw new Error(`Unkown style config “${config}”.`)
      }
    }
  }

  /**
   * @param {module:@bldr/lamp~styleConfig} styleConfig
   */
  set (styleConfig) {
    if (!styleConfig) styleConfig = {}
    this.set_(Object.assign(this.defaults_(), styleConfig))
  }
}
