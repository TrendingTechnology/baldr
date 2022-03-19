import { validateDefintion } from '../../main.js'
export default validateDefintion({
  command: 'open-media <path>',
  alias: 'om',
  checkExecutable: 'xdg-open',
  description:
    'Open a file in an external application, for example: svg -> inkscape, jpg -> gimp, pdf -> evince.'
})
