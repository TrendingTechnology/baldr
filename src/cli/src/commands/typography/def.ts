import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'typography [files...]',
  alias: 'ty',
  description: 'Fix some typographic issues, for example quotes “…” -> „…“'
}
