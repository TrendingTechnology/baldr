import { LampTypes } from '@bldr/type-definitions'

/**
 * Validate the master specification. This function doesn’t change the
 * the input object. The input object is passed through unchanged. The
 * validation handles Typescript.
 *
 * @param masterSpec The specification of the master slide.
 *
 * @returns The unchanged object of the specification.
 */
export function validateMasterSpec (masterSpec: LampTypes.MasterSpec): LampTypes.MasterSpec {
  return masterSpec
}

type StepProp = 'selector' | 'mode' | 'subset'

/**
 * Map step support related props for the use as Vuejs props.
 */
export function mapStepProps (selectors: StepProp[]): LampTypes.PropsDefintion {
  const props: LampTypes.PropsDefintion = {
    selector: {
      description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen. „none“ deaktiviert die Unterstützung für Schritte.',
      default: 'g[inkscape\\:groupmode="layer"]'
    },
    mode: {
      type: String,
      description: '„words“ oder „sentences“'
    },
    subset: {
      type: String,
      description: 'Eine Untermenge von Schritten auswählen (z. B. 1,3,5 oder 2-5).'
    }
  }

  const result: LampTypes.PropsDefintion = {}
  for (const selector of selectors) {
    if (props[selector] != null) {
      result[`step${selector.charAt(0).toUpperCase()}${selector.substr(1).toLowerCase()}`] = props[selector]
    }
  }
  return result
}
