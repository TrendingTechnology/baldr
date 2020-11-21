import { MasterTypes } from '@bldr/type-definitions'

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
class MasterIcon implements MasterTypes.MasterIconSpec {
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

  constructor ({ name, color, size, showOnSlides }: MasterTypes.MasterIconSpec) {
    if (size && !['small', 'large'].includes(size)) {
      throw new Error(`The property “size” of the “MasterIcon” has to be “small” or “large” not ${size}`)
    }

    if (showOnSlides !== undefined && typeof showOnSlides !== 'boolean') {
      throw new Error(`The property “showOnSlide” of the “MasterIcon” has to be “boolean” not ${showOnSlides}`)
    }

    this.name = name
    this.color = color || 'orange'
    this.showOnSlides = showOnSlides !== false
    this.size = size || 'small'
  }
}

/**
 * Each master slide is a instance of this class. This class has many dummy
 * methods. They are there for documentation reasons. On the other side they
 * are useful as default methods. You have not to check if a master slide
 * implements a specific hook.
 */
export class Master {
    /**
     * A instance of `MasterIcon` which holds information about the master icon.
     */
    icon: MasterIcon

    /**
     * Some markdown formated string to document this master slide.
     */
    documentation?: string

    private spec: MasterTypes.MasterSpec

  /**
   * @param spec - The default exported object from the `main.js`
   * file.
   */
  constructor (spec: MasterTypes.MasterSpec) {
    this.spec = spec
    this.icon = new MasterIcon(spec.icon)
  }

  /**
   * The short name of the master slide. Should be a shorter string without
   * spaces in the camelCase format.
   */
  get name(): string {
    return this.spec.name
  }

  /**
   * The human readable title of the master slide.
   */
  get title(): string {
    return this.spec.name
  }

  /**
   * The name of the props which are supporting inline media (for example
   * `markup`)
   */
  get propNamesInlineMedia (): string[] {
    const inlineMarkupProps = []
    for (const propName in this.spec.propsDef) {
      const propDef = this.spec.propsDef[propName]
      if (propDef.inlineMarkup) {
        inlineMarkupProps.push(propName)
      }
    }
    return inlineMarkupProps
  }

  /**
   * Filter the master props for props which are supporting inline media.
   */
  // extractInlineMediaUris (props: MasterTypes.StringObject): Set<string> {
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
  // renderInlineMedia (props: MasterTypes.StringObject) {
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

  /**
   * Convert in the props certain strings containing markup to HTML.
   */
  // markupToHtml (props: MasterTypes.StringObject): MasterTypes.StringObject {
  //   if (!this.propsDef) return props
  //   for (const propName in props) {
  //     const prop = this.propsDef[propName]
  //     if ('markup' in prop && prop.markup) {
  //       props[propName] = markupToHtml(props[propName])
  //     }
  //   }
  //   return props
  // }

  /**
   * Raise an error if there is an unkown prop - a not in the `props` section
   * defined prop.
   */
  detectUnkownProps (props: MasterTypes.StringObject) {
    for (const propName in props) {
      if (this.spec.propsDef && !(propName in this.spec.propsDef)) {
        throw new Error(`The master slide “${this.name}” has no property named “${propName}”.`)
      }
    }
  }

  /**
   * Validate all media file URIs in the props of a certain slide.
   */
  // validateUris (props: MasterTypes.StringObject): MasterTypes.StringObject {
  //   if (!this.spec.propsDef) return props
  //   for (const propName in props) {
  //     const prop = this.spec.propsDef[propName]
  //     if ('assetUri' in prop && prop.assetUri) {
  //       props[propName] = validateUri(props[propName])
  //     }
  //   }
  //   return props
  // }

  /**
   * Call a master hook. Master hooks are definied in the `main.js`
   * files.
   *
   * @param hookName - The name of the master hook / function.
   * @param payload - The argument the master hook / function is called
   *   with.
   */
  private callHook (hookName: string, payload: any, thisArg?: ThisArg): any {
    if (this.spec.hooks && this.spec.hooks[hookName] && typeof this.spec.hooks[hookName] === 'function') {
      if (thisArg) {
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
    if (this.spec.hooks && this.spec.hooks[hookName] && typeof this.spec.hooks[hookName] === 'function') {
      if (thisArg) {
        return this.spec.hooks[hookName].call(thisArg, payload)
      }
      return this.spec.hooks[hookName](payload)
    }
  }

  /**
   * Normalize the properties so the result fits to props defintion of the
   * master slide.. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`)
   */
  normalizeProps (propsRaw: any): MasterTypes.StringObject {
    return this.callHook('normalizeProps', propsRaw)
  }

  /**
   * Retrieve the media URIs which have to be resolved.
   *
   * Call the master funtion `resolveMediaUris` and collect the media URIs.
   * (like [id:beethoven, id:mozart]). Extract media URIs from
   * the text props.
   */
  // resolveMediaUris (props: MasterTypes.StringObject): Set<string> | undefined {
  //   let uris = this.callHook('resolveMediaUris', props)

  //   // To allow undefined return values of the hooks.
  //   if (!uris) {
  //     uris = new Set()
  //   } else if (typeof uris === 'string') {
  //     uris = new Set([uris])
  //   } else if (Array.isArray(uris)) {
  //     uris = new Set(uris)
  //   }

  //   const inlineUris = this.extractInlineMediaUris(props)
  //   for (const uri of inlineUris) {
  //     uris.add(uri)
  //   }

  //   if (uris.size) return uris
  // }

  /**
   * Check if the handed over media URIs can be resolved. Throw no errors, if
   * the media assets are not present. This hook is used in the YouTube master
   * slide. This master slide uses the online version, if no offline video could
   * be resolved. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`).
   */
  resolveOptionalMediaUris (props: MasterTypes.StringObject): Set<string> | undefined {
    let uris = this.callHook('resolveOptionalMediaUris', props)

    // To allow undefined return values of the hooks.
    if (!uris) {
      uris = new Set()
    } else if (typeof uris === 'string') {
      uris = new Set([uris])
    }
    if (uris.size) return uris
  }

  /**
   * This hook after is called after loading. To load resources in the
   * background. Goes in the background. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`).
   *
   * - `this`: is the main Vue instance.
   *
   * @param props - The properties of the slide.
   */
  afterLoading (props: MasterTypes.StringObject, thisArg: ThisArg): void {
    this.callHook('afterLoading', { props, master: this }, thisArg)
  }

  /**
   * This hook gets executed after the media resolution. Wait for this hook to
   * finish. Go not in the background. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`). Blocks.
   *
   * - `this`: is the main Vue instance.
   *
   * @param props - The properties of the slide.
   */
  async afterMediaResolution (props: MasterTypes.StringObject, thisArg: ThisArg) {
    await this.callHookAsync('afterMediaResolution', { props, master: this }, thisArg)
  }

  /**
   * Collect the props (properties) for the main Vue component.
   *
   * @param props - The props of the master slide.
   *
   * @returns The props for the main component as a object.
   */
  collectPropsMain (props: MasterTypes.StringObject, thisArg: ThisArg): MasterTypes.StringObject {
    const propsMain = this.callHook('collectPropsMain', props, thisArg)
    if (propsMain) return propsMain
    return props
  }

  /**
   * Collect the props (properties) for the preview Vue component. Called
   * during the parsing the YAML file (`Praesentation.baldr.yml`).
   *
   * - `this`: is the main Vue instance.
   *
   * @returns The props for the preview component as a object.
   */
  collectPropsPreview (payload: MasterTypes.PropsAndSlide, thisArg: ThisArg): MasterTypes.StringObject {
    const propsPreview = this.callHook('collectPropsPreview', payload, thisArg)
    if (propsPreview) return propsPreview
    if (payload.propsMain) return payload.propsMain
    return payload.props
  }

  /**
   * Calculate from the given props the step count. This hook method is called
   * after media resolution. Called during the parsing the YAML file
   * (`Praesentation.baldr.yml`).
   *
   * - `this`: is the main Vue instance.
   * - `return`: a number or an array of slide steps.
   *
   * @returns The steps count.
   */
  calculateStepCount (payload: MasterTypes.PropsSlideAndMaster, thisArg: ThisArg): number {
    return this.callHook('calculateStepCount', payload, thisArg)
  }

  /**
   * Determine a title from the properties.
   */
  titleFromProps (payload: MasterTypes.PropsBundle): string {
    return this.callHook('titleFromProps', payload)
  }

  /**
   * Extract a plain text from the props (properties) of a slide.
   */
  plainTextFromProps (props: any): string {
    return this.callHook('plainTextFromProps', props)
  }

  /**
   * Called when leaving a slide. This hook is triggered by the Vue lifecycle
   * hook `beforeDestroy`.
   */
  leaveSlide (payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void {
    this.callHook('leaveSlide', payload, thisArg)
  }

  /**
   * Called when entering a slide. This hook is only called on the public master
   * component (the one that is visible for the audience), not on further
   * secondary master components (for example the ad hoc slides or the future
   * slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from within the Vuex store in the file  `store.js`.
   */
  enterSlide (payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg):void {
    this.callHook('enterSlide', payload, thisArg)
  }

  /**
   * This hook gets executed after the slide number has changed on the
   * component. Use `const slide = this.$get('slide')` to get the current slide
   * object.
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   */
  afterSlideNoChangeOnComponent (payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void {
    this.callHook('afterSlideNoChangeOnComponent', payload, thisArg)
  }

  /**
   * Called when leaving a step. This hook is only called on the public master
   * component (the one that is visible for the audience), not on further
   * secondary master components (for example the ad hoc slides or the future
   * slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
   */
  leaveStep (payload: MasterTypes.OldAndNewStepNo, thisArg: ThisArg) {
    return this.callHook('leaveStep', payload, thisArg)
  }

  /**
   * Called when entering a step. This hook is only called on the public
   * master component (the one that is visible for the audience), not on
   * further secondary master components (for example the ad hoc slides or the
   * future slide view in the speakers view.)
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
   */
  enterStep (payload: MasterTypes.OldAndNewStepNo, thisArg: ThisArg): void {
    return this.callHook('enterStep', payload, thisArg)
  }

  /**
   * This hook gets executed after the step number has changed on the
   * component.
   *
   * - `this`: is the Vue instance of the current main master component.
   * - called from the master component mixin in the file `masters.js`.
   */
  afterStepNoChangeOnComponent (payload: MasterTypes.OldAndNewStepNoAndSlideNoChange, thisArg: ThisArg): void {
    this.callHook('afterStepNoChangeOnComponent', payload, thisArg)
  }
}
