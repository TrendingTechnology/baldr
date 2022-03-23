import { validateDefintion } from '../../main.js';
export default validateDefintion({
    command: 'pdf-text-extract <path>',
    checkExecutable: 'pdftotext',
    description: 'Extract the text of a PDF file and convert it into YAML.'
});
