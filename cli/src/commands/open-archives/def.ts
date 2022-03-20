import { validateDefintion } from '../../main'

export default validateDefintion({
  command: 'open-archives [path]',
  alias: 'oa',
  options: [['-c, --create-dirs', 'Create missings directories.']],
  checkExecutable: 'xdg-open',
  description:
    'Open the parent presentation folder and the corresponding archive folders of the given file path.'
})
