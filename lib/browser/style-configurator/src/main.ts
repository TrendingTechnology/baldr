import type { LampTypes } from '@bldr/type-definitions'

class AttributeSetter<T> {
  public attributeName: string
  protected attributeValue: T
  protected defaultValue: T

  constructor (attributeName: string, defaultValue: T) {
    this.attributeName = attributeName
    this.attributeValue = defaultValue
    this.defaultValue = defaultValue
  }

  get attributeValueAsString (): string {
    return String(this.attributeValue)
  }

  set (attributeValue: any): void {
    this.attributeValue = attributeValue
    const elements = document.querySelectorAll(`[${this.attributeName}]`)
    for (const element of elements) {
      element.attributes[this.attributeName as any].value = this.attributeValueAsString
    }
  }

  reset (): void {
    this.set(this.defaultValue)
  }
}

class StringAttributeSetter extends AttributeSetter<string> {
}

class BooleanAttributeSetter extends AttributeSetter<boolean> {
  toggle (): boolean {
    this.set(!this.attributeValue)
    return this.attributeValue
  }
}

class DarkModeSetter extends BooleanAttributeSetter {
  constructor () {
    super('b-dark-mode', false)
  }
}

class CenterVerticallySetter extends BooleanAttributeSetter {
  constructor () {
    super('b-center-vertically', false)
  }
}

class ContentThemeSetter extends StringAttributeSetter {
  constructor () {
    super('b-content-theme', 'default')
  }

  set (themeName: string): void {
    super.set(themeName)
    const elements = document.querySelectorAll(`[${this.attributeName}]`)
    for (const element of elements) {
      // Preview slide editor has content-theme handwriting, which should
      // be unchangeable.
      if ((element.attributes['b-content-theme-unchangeable' as any]) == null) {
        element.attributes[this.attributeName as any].value = this.attributeValueAsString
      }
    }
  }
}

class UiThemeSetter extends StringAttributeSetter {
  constructor () {
    super('b-ui-theme', 'default')
  }
}

type StyleConfigName =
  'centerVertically' |
  'contentTheme' |
  'darkMode' |
  'uiTheme'

export class StyleConfigurator {
  private readonly setterCollection = {
    darkMode: new DarkModeSetter(),
    contentTheme: new ContentThemeSetter(),
    uiTheme: new UiThemeSetter(),
    centerVertically: new CenterVerticallySetter()
  }

  constructor() {
    const body  = document.querySelector('body')
    if (body != null) {
      body.setAttribute(this.setterCollection.darkMode.attributeName, 'false')
    }
  }

  reset (): void {
    for (const setterName in this.setterCollection) {
      const name: StyleConfigName = setterName as StyleConfigName
      if (this.setterCollection[name] != null) {
        this.setterCollection[name].reset()
      } else {
        throw new Error(`Unkown style config “${name}”.`)
      }
    }
  }

  set (styleConfig: LampTypes.StyleConfig): void {
    for (const setterName in styleConfig) {
      const name: StyleConfigName = setterName as StyleConfigName
      if (this.setterCollection[name] != null) {
        this.setterCollection[name].set(styleConfig[name] as any)
      } else {
        throw new Error(`Unkown style config “${name}”.`)
      }
    }
  }

  toggleDarkMode (): void {
    this.setterCollection.darkMode.toggle()
  }

  toggleCenterVertically (): void {
    this.setterCollection.centerVertically.toggle()
  }

  toggleFullscreen = function () {
    if (document.fullscreenElement == null) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  setContentTheme (themeName: string): void {
    this.setterCollection.contentTheme.set(themeName)
  }

  setUiTheme (themeName: string): void {
    this.setterCollection.uiTheme.set(themeName)
  }
}

export const styleConfigurator = new StyleConfigurator()
