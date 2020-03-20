module.exports = {
  command: 'move [files...]',
  alias: 'mv',
  options: [
    ['-c, --copy', 'Copy instead of move.'],
    ['-d, --dry-run', 'Do nothing, only show messages.'],
    ['-e, --extension <extension>', 'Move only file with the specified extension.']
  ],
  description: 'Move / copy files from the main media directory to the archive folder or vice versa.',
}
