import { validateDefintion } from '../../main.js';
export default validateDefintion({
    command: 'open-parent-folder <path>',
    checkExecutable: 'xdg-open',
    description: 'Open the parent folder of a file path in the file manager.'
});
