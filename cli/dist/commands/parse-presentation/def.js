import { validateDefintion } from '../../main.js';
export default validateDefintion({
    command: 'parse-presentation [path]',
    alias: 'pp',
    options: [['--resolve', 'Resolve the media assets.']],
    description: 'Parse a presentation file named “Praesentation.baldr.yml” or ' +
        'all presentation files in the current working directory. ' +
        'By default the media URIs are only checked. ' +
        'Use the option --resolve to resolve the complete media assets.'
});
