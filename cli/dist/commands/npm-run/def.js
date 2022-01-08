import { validateDefintion } from '../../main.js';
export default validateDefintion({
    command: 'npm-run <scriptName> <file>',
    description: 'Change to the parent directory of the specified file and run “npm run <scriptName>”',
    checkExecutable: 'npm'
});
