module.exports = {
  command: 'tex-build [files...]',
  alias: 'tb',
  description: 'Build TeX files.',
  checkExecutable: [
    'lualatex'
  ]
}
