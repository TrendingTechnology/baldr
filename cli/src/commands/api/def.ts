import { validateDefintion } from '../../main.js'

export default validateDefintion({
  command: 'api [port]',
  alias: 'a',
  options: [
    ['-r, --restart', 'Restart the REST API.']
  ],
  description: 'Launch the REST API server. Specifiy a port to listen to if you what a different one than the default one.'
})
