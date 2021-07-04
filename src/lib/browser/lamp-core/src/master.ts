import type { LampTypes } from '@bldr/type-definitions'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { validateUri } from '@bldr/core-browser'

/**
 * The
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
 * a function is called with.
 */
type ThisArg = object

/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon implements LampTypes.MasterIconSpec {
  /**
   * For allowed icon names see the
   * {@link module:@bldr/icons Baldr icon font}.
   */
  name: string

  /**
   * A color name (CSS color class name) to colorize the master icon.
   * @see {@link module:@bldr/themes}
   */
  color: string

  /**
   * The size of a master icon: `small` or `large`.
   */
  size?: 'large' | 'small'

  /**
   * Show the icon on the slide view.
   */
  showOnSlides: boolean

  constructor ({ name, color, size, showOnSlides }: LampTypes.MasterIconSpec) {
    if (size != null && !['small', 'large'].includes(size)) {
      throw new Error(`The property “size” of the “MasterIcon” has to be “small” or “large” not ${size}`)
    }

    this.name = name
    this.color = color != null ? color : 'orange'
    this.showOnSlides = showOnSlides !== false
    this.size = size != null ? size : 'small'
  }
}

/**
 * Each master slide has an instance of this class.
 */
export class Master implements LampTypes.Master {
  icon: MasterIcon
  documentation?: string

  /**
   * The specification of the master slide provided by a master package.
   */
  private readonly spec: LampTypes.MasterSpec

  /**
   * @param spec - The specification of the master slide provided by a master
   * package.
   */
  constructor (spec: LampTypes.MasterSpec) {
    this.spec = spec
    this.icon = new MasterIcon(spec.icon)
  }

  get name (): string {
    return this.spec.name
  }

  get title (): string {
    return this.spec.title
  }

  get propNamesInlineMedia (): string[] {
    const inlineMarkupProps = []
    for (const propName in this.spec.propsDef) {
      const propDef = this.spec.propsDef[propName]
      if (propDef.inlineMarkup != null && propDef.inlineMarkup) {
        inlineMarkupProps.push(propName)
      }
    }
    return inlineMarkupProps
  }

  /**
   * Filter the master props for props which are supporting inline media.
   */
  // extractInlineMediaUris (props: LampTypes.StringIndexedData): Set<string> {
  //   const uris = new Set<string>()

  //   function extractUrisInText (text: string) {
  //     const matches = text.matchAll(new RegExp(inlineMarkup.regExp, 'g'))
  //     for (const match of matches) {
  //       //  12    3            4
  //       // [((id):(Fuer-Elise))( caption="Für Elise")]
  //       if (match[2] === 'id') uris.add(match[1])
  //     }
  //   }

  //   for (const propName of this.propNamesInlineMedia) {
  //     const prop = props[propName]
  //     if (prop) {
  //       if (typeof prop === 'string') {
  //         extractUrisInText(prop)
  //       // `markup` in `generic` is an array.
  //       } else if (Array.isArray(prop)) {
  //         for (const item of prop) {
  //           extractUrisInText(item)
  //         }
  //       }
  //     }
  //   }
  //   return uris
  // }

  /**
   * Replace the inline media tags `[id:Beethoven]` in certain props with
   * HTML. This function must be called after the media resolution.
   */
  // renderInlineMedia (props: LampTypes.StringIndexedData) {
  //   /**
  //    * @param {String} text
  //    */
  //   function renderOneMediaUri (text) {
  //     return text.replace(new RegExp(inlineMarkup.regExp, 'g'), function (match) {
  //       const item = new inlineMarkup.Item(match)
  //       return inlineMarkup.render(item)
  //     })
  //   }

  //   for (const propName of this.propNamesInlineMedia) {
  //     const prop = props[propName]
  //     if (prop) {
  //       if (typeof prop === 'string') {
  //         props[propName] = renderOneMediaUri(prop)
  //       // `markup` in `generic` is an array.
  //       } else if (Array.isArray(prop)) {
  //         for (let i = 0; i < prop.length; i++) {
  //           props[propName][i] = renderOneMediaUri(prop[i])
  //         }
  //       }
  //     }
  //   }
  // }

  convertMarkdownToHtml (props: LampTypes.StringIndexedData): LampTypes.StringIndexedData {
    if (this.spec.propsDef == null) {
      return props
    }
    for (const propName in props) {
      const prop = this.spec.propsDef[propName]
      if (prop.markup != null && prop.markup) {
        props[propName] = convertMarkdownToHtml(props[propName])
      }
    }
    return props
  }

  detectUnkownProps (props: LampTypes.StringIndexedData): void {
    for (const propName in props) {
      if ((this.spec.propsDef != null) && !(propName in this.spec.propsDef)) {
        throw new Error(`The master slide “${this.name}” has no property named “${propName}”.`)
      }
    }
  }

  validateUris (props: LampTypes.StringIndexedData): LampTypes.StringIndexedData {
    if (this.spec.propsDef == null) {
      return props
    }
    for (const propName in props) {
      const prop = this.spec.propsDef[propName]
      if (prop.assetUri != null) {
        props[propName] = validateUri(props[propName])
      }
    }
    return props
  }

  /**
   * Call a master hook. Master hooks are definied in the `main.js`
   * files.
   *
   * @param hookName - The name of the master hook / function.
   * @param payload - The argument the master hook / function is called
   *   with.
   */
  private callHook (hookName: string, payload: any, thisArg?: ThisArg): any {
    // eslint-disable-next-line
    if ((this.spec.hooks != null) && this.spec.hooks[hookName] != null && typeof this.spec.hooks[hookName] === 'function') {
      if (thisArg != null) {
        return this.spec.hooks[hookName].call(thisArg, payload)
      }
      return this.spec.hooks[hookName](payload)
    }
  }

  /**
   * Asynchronous version. Call a master hook. Master hooks are definied in the
   * `main.js` files.
   *
   * @param hookName - The name of the master hook / function.
   * @param payload - The argument the master hook / function is called
   *   with.
   */
  private async callHookAsync (hookName: string, payload: any, thisArg?: ThisArg): Promise<any> {
    // eslint-disable-next-line
    if (this.spec.hooks != null && this.spec.hooks[hookName] != null && typeof this.spec.hooks[hookName] === 'function') {
      if (thisArg != null) {
        return this.spec.hooks[hookName].call(thisArg, payload)
      }
      return this.spec.hooks[hookName](payload)
    }
  }

  normalizeProps (propsRaw: any): LampTypes.StringIndexedData {
    return this.callHook('normalizeProps', propsRaw)
  }

  private normalizeUris (uris?: Set<string> | string | string[]): Set<string> | undefined {
    let normalizedUris: Set<string> | null
    // To allow undefined return values of the hooks.
    if (uris == null) {
      normalizedUris = new Set()
    } else if (typeof uris === 'string') {
      normalizedUris = new Set([uris])
    } else if (Array.isArray(uris)) {
      normalizedUris = new Set(uris)
    } else {
      normalizedUris = null
    }
    if (normalizedUris != null && normalizedUris.size > 0) {
      return normalizedUris
    }
  }

  resolveMediaUris (props: LampTypes.StringIndexedData): Set<string> | undefined {
    const uris = this.callHook('resolveMediaUris', props)

    // const inlineUris = this.extractInlineMediaUris(props)
    // for (const uri of inlineUris) {
    //   uris.add(uri)
    // }

    return this.normalizeUris(uris)
  }

  resolveOptionalMediaUris (props: LampTypes.StringIndexedData): Set<string> | undefined {
    const uris = this.callHook('resolveOptionalMediaUris', props)
    return this.normalizeUris(uris)
  }

  afterLoading (props: LampTypes.StringIndexedData, thisArg: ThisArg): void {
    this.callHook('afterLoading', { props, master: this }, thisArg)
  }

  async afterMediaResolution (props: LampTypes.StringIndexedData, thisArg: ThisArg): Promise<void> {
    await this.callHookAsync('afterMediaResolution', { props, master: this }, thisArg)
  }

  collectPropsMain (props: LampTypes.StringIndexedData, thisArg: ThisArg): LampTypes.StringIndexedData {
    const propsMain = this.callHook('collectPropsMain', props, thisArg)
    if (propsMain != null) {
      return propsMain
    }
    return props
  }

  collectPropsPreview (payload: LampTypes.PropsAndSlide, thisArg: ThisArg): LampTypes.StringIndexedData {
    const propsPreview = this.callHook('collectPropsPreview', payload, thisArg)
    if (propsPreview != null) {
      return propsPreview
    }
    if (payload.propsMain != null) {
      return payload.propsMain
    }
    return payload.props
  }

  calculateStepCount (payload: LampTypes.PropsSlideAndMaster, thisArg: ThisArg): number {
    return this.callHook('calculateStepCount', payload, thisArg)
  }

  titleFromProps (payload: LampTypes.PropsBundle): string {
    return this.callHook('titleFromProps', payload)
  }

  plainTextFromProps (props: any): string {
    return this.callHook('plainTextFromProps', props)
  }

  leaveSlide (payload: LampTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void {
    this.callHook('leaveSlide', payload, thisArg)
  }

  enterSlide (payload: LampTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void {
    this.callHook('enterSlide', payload, thisArg)
  }

  afterSlideNoChangeOnComponent (payload: LampTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void {
    this.callHook('afterSlideNoChangeOnComponent', payload, thisArg)
  }

  leaveStep (payload: LampTypes.OldAndNewStepNo, thisArg: ThisArg): void {
    return this.callHook('leaveStep', payload, thisArg)
  }

  enterStep (payload: LampTypes.OldAndNewStepNo, thisArg: ThisArg): void {
    return this.callHook('enterStep', payload, thisArg)
  }

  afterStepNoChangeOnComponent (payload: LampTypes.OldAndNewStepNoAndSlideNoChange, thisArg: ThisArg): void {
    this.callHook('afterStepNoChangeOnComponent', payload, thisArg)
  }
}
