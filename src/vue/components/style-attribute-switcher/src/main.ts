import { MasterTypes } from '@bldr/type-definitions'

class AttributeSetter {
  attributeName: string
  attributeValue: boolean = true

  constructor (attributeName: string) {
    this.attributeName = attributeName
  }

  get stateAsString (): string {
    return `${this.attributeValue}`
  }

  set (state: boolean = false): void {
    this.attributeValue = state
  }

  toggle (): boolean {
    this.set(!this.attributeValue)
    return this.attributeValue
  }
}

/**
 * Set multiple attributes at the same time
 */
class MultipleAttributesSwitcher extends AttributeSetter {
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

class BodyAttributesSwitcher extends AttributeSetter {
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

class DarkModeSetter extends BodyAttributesSwitcher {
  constructor () {
    super('b-dark-mode')
    this.attributeValue = false
  }
}

class ContentThemeSetter extends MultipleAttributesSwitcher {
  constructor () {
    super('b-content-theme')
  }

  set (state: boolean = false) {
    this.attributeValue = state
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

class UiThemeSetter extends MultipleAttributesSwitcher {
  constructor () {
    super('b-ui-theme')
  }
}

/**
 *
 */
class StyleConfigurator {
  darkModeSetter = new DarkModeSetter()
  contentThemeSetter = new ContentThemeSetter()
  uiThemeSetter = new UiThemeSetter()

  constructor () {
    this.darkModeSetter = new DarkModeSetter()
    this.contentThemeSetter = new ContentThemeSetter()
    this.uiThemeSetter = new UiThemeSetter()
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
