import { validateDefintion } from '../../main.js'

export default validateDefintion({
  command: 'presentation-template [path]',
  alias: 'p',
  options: [['-f, --force', 'Overwrite an existing presentation file.']],
  description:
    'Create a presentation template from the assets of the current working directory named “Praesentation.baldr.yml”.'
})
