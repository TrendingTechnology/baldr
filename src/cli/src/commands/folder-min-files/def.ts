import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'folder-min-files [filePath]',
  options: [
    ['-m, --min <count>', 'Min files']
  ],
  description: 'List files of folders containing more than 20 files.'
})
