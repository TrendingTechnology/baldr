import { validateDefintion } from '../../main.js'

export default validateDefintion({
  command: 'normalize [files...]',
  options: [
    ['--presentation', 'Only normalize presentations.'],
    ['--tex', 'Only normalize TeX files.'],
    ['--asset', 'Only normalize assets.']
  ],
  alias: 'n',
  description:
    'Combine multiple tasks to manipulate the metadata, ' +
    'presentation and TeX files. Create associated metadata files ' +
    'for new media files. Normalize the existing metadata files (sort, clean up). ' +
    'A keyboard shortcut is assigned to this task.'
})
