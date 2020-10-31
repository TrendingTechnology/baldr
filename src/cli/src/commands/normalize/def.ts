import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'normalize [files...]',
  options: [
    ['-w, --wikidata', 'Call wikidata to enrich the metadata.']
  ],
  alias: 'n',
  description: 'Normalize the metadata files in the YAML format (sort, clean up).'
}
