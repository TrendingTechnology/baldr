import { validateDefintion } from '../../main.js'
export default validateDefintion({
  command: 'ocr <path>',
  checkExecutable: 'ocrmypdf',
  description: 'Perform optical text recognition on a PDF file.'
})
