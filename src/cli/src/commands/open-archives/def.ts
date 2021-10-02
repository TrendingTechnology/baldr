import { validateDefintion } from '../../main'
export = validateDefintion({
  command: 'open-archives [path]',
  alias: 'oa',
  options: [['-c, --create-dirs', 'Create missings directories.']],
  checkExecutable: 'xdg-open',
  description:
    'Open the parent presentation archive folders of the given file path.'
})
