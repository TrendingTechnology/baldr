import { validateDefintion } from '../../main.js';
export default validateDefintion({
    command: 'tex-build [files...]',
    alias: 'tb',
    description: 'Build TeX files.',
    checkExecutable: [
        'lualatex'
    ]
});
