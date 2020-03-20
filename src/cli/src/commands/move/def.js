module.exports = {
  command: 'move [files...]',
  alias: 'mv',
  options: [
    ['-c, --copy', 'Copy instead of move.'],
    ['-d, --dry-run', 'Do nothing, only show messages.'],
    ['-e, --extension <extension>', 'Move only file with the specified extension.']
  ],
  description: 'Move / copy files from the archive folder to the main media directory. Place files which already in the main media folder into the right place (the right subfolder for example)',
}
