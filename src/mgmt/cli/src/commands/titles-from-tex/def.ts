import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'titles-from-tex [files...]',
  alias: 'tf',
  options: [
    ['-f, --force', 'Overwrite existing `title.txt` files.']
  ],
  description: 'Create from the TeX files the folder titles text file `title.txt`.'
})
