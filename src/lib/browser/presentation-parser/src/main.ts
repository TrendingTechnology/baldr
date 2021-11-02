import { Presentation } from './presentation'

export function parse (yamlString: string): Presentation {
  return new Presentation(yamlString)
}

export async function parseAndResolve (
  yamlString: string
): Promise<Presentation> {
  const presentation = new Presentation(yamlString)
  await presentation.resolve()
  return presentation
}
