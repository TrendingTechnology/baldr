import {
  ClozeSelector,
  ElementSelector,
  InkscapeSelector,
  WordSelector,
  SentenceSelector,
  DomEntry,
  InkscapeMode
} from './selector'

import { StepController } from './controller'

export function buildClozeStepController (
  entry: DomEntry,
  stepSubset?: string
): StepController {
  const selector = new ClozeSelector(entry)
  return new StepController(selector.select(), stepSubset)
}

interface InteractiveGraphicFields {
  stepSelector?: string
  mode?: InkscapeMode
  stepSubset?: string
}

export function buildSvgStepController (
  entry: DomEntry,
  fields: InteractiveGraphicFields
): StepController {
  let selector
  if (fields.stepSelector != null) {
    selector = new ElementSelector(entry, fields.stepSelector)
  } else {
    selector = new InkscapeSelector(entry, fields.mode)
  }
  return new StepController(selector.select(), fields.stepSubset)
}

interface TextFields {
  stepMode?: 'words' | 'sentences'
  stepSubset?: string
}

export function buildTextStepController (
  entry: DomEntry,
  fields: TextFields
): StepController {
  let selector
  if (fields.stepMode == null) {
    fields.stepMode = 'words'
  }
  if (fields.stepMode === 'words') {
    selector = new WordSelector(entry)
  } else {
    selector = new SentenceSelector(entry)
  }
  return new StepController(selector.select(), fields.stepSubset)
}
