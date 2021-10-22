import { Presentation } from './presentation'

export function parse (yamlString: string): Presentation {
  return new Presentation(yamlString)
}
