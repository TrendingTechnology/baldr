module.exports = {
  command: 'wikidata <item-id> [firstname] [lastname]',
  options: [
    ['-p, --person', 'A person'],
    ['-g, --group', 'A group']
  ],
  alias: 'w',
  description: 'Query wikidata.org (currently there is only support for the master slide “person”).',
}
