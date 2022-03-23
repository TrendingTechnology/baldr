import * as cliUtils from '@bldr/cli-utils';
import { convertTextFileToYaml } from '../ocr/action';
export default async function action(filePath) {
    // Musicassette-9-10_1991.pdf.yml -> Musicassette-9-10_1991.pdf
    filePath = filePath.replace(/\.yml$/, '');
    filePath = filePath.replace(/_preview\.jpg$/, '');
    const txtFile = filePath.replace(/\.pdf$/, '.txt');
    await cliUtils.execute(['pdftotext', filePath]);
    convertTextFileToYaml(txtFile, txtFile + '.yml');
}
