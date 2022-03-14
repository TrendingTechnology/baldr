import { validateDefintion } from '../../main.js';
export default validateDefintion({
    command: 'open-media <path>',
    alias: 'om',
    checkExecutable: 'xdg-open',
    description: 'Open a media file in an external applications, for example svg -> inkscape, jpg -> gimp, pdf -> evince'
});
