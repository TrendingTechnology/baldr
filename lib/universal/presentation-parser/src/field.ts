import { capitalize } from '@bldr/string-format'

/**
 * Some data indexed by strings
 */
export interface FieldData {
  [fieldName: string]: any
}

/**
 * We name the properties of a master slide “field” to better distinguish them
 * from the Vue properties “props”. It is an extended version of the Vue `props` defintion.
 *
 * ```js
 *  const fields = {
 *    src: {
 *      default: 'ref:Fuer-Elise'
 *      description: 'Den URI zu einer Video-Datei.',
 *      inlineMarkup: false
 *      markup: false
 *      assetUri: true,
 *      required: true,
 *      type: String,
 *    }
 *  }
 * ```
 */
export interface FieldDefinition {
  /**
   * A default value.
   */
  default?: any

  /**
   * Text to describe the property. A descriptive text shown in the
   * documentation.
   */
  description?: string

  /**
   * Indicates that this `prop` is text for extracting inline media URIs
   * like `[id:Beethoven_Ludwig-van]`.
   */
  inlineMarkup?: boolean

  /**
   * The specified value can contain markup. The value can be written in
   * Markdown and or in HTML. Markdown is converted into HTML. The key
   * `type` has to be `String`.
   */
  markup?: boolean

  /**
   * Indicates that this `field` contains a media file URI.
   */
  assetUri?: boolean

  /**
   * Must be specifed.
   */
  required?: boolean

  /**
   * The same as Vue `type`.
   */
  type?: object

  /**
   * A function to validate the input. Return false if the input is not valid.
   */
  validate?: (input: any) => boolean
}

type StepFieldNames = 'selector' | 'mode' | 'subset'

export interface FieldDefinitionCollection {
  [fieldName: string]: FieldDefinition
}

const stepFieldDefinitions: FieldDefinitionCollection = {
  selector: {
    type: String,
    description:
      'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen.'
  },
  mode: {
    type: String,
    description: '„words“ oder „sentences“'
  },
  subset: {
    type: String,
    description:
      'Eine Untermenge von Schritten auswählen (z. B. 1,3,5 oder 2-5).'
  }
}

/**
 * Map step support related fields.
 *
 * @param selectors - At the moment: “selector”, “mode” and “subset”.
 */
export function mapStepFieldDefintions (
  selectors: StepFieldNames[]
): FieldDefinitionCollection {
  const result: FieldDefinitionCollection = {}
  for (const selector of selectors) {
    if (stepFieldDefinitions[selector] != null) {
      result[`step${capitalize(selector)}`] = stepFieldDefinitions[selector]
    }
  }
  return result
}

// node_modules/vue/types/options.d.ts
type DefaultProps = Record<string, any>

type Prop<T> =
  | (() => T)
  | (new (...args: never[]) => T & object)
  | (new (...args: string[]) => Function)

type PropType<T> = Prop<T> | Array<Prop<T>>

type PropValidator<T> = PropOptions<T> | PropType<T>

interface PropOptions<T = any> {
  type?: PropType<T>
  required?: boolean
  default?: T | null | undefined | (() => T | null | undefined)
  validator?: (value: T) => boolean
}

type RecordPropsDefinition<T> = {
  [K in keyof T]: PropValidator<T[K]>
}
type ArrayPropsDefinition<T> = Array<keyof T>
type PropsDefinition<T> = ArrayPropsDefinition<T> | RecordPropsDefinition<T>

type VuePropsDefintion = PropsDefinition<DefaultProps>

/**
 * Map step support related fields.
 *
 * @param selectors - At the moment: “selector”, “mode” and “subset”.
 *
 * @returns should return `PropsDefinition<DefaultProps>`
 */
export function mapStepFieldDefintionsToProps (
  selectors: StepFieldNames[]
): VuePropsDefintion {
  const result: FieldDefinitionCollection = {}
  for (const selector of selectors) {
    if (stepFieldDefinitions[selector] != null) {
      result[`step${capitalize(selector)}`] = stepFieldDefinitions[selector]
    }
  }
  return result as VuePropsDefintion
}
