import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'typography [files...]',
  alias: 'ty',
  description: 'Fix some typographic issues, for example quotes “…” -> „…“'
})
