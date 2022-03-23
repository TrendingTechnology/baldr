import * as cliUtils from '@bldr/cli-utils';
import { readFile, writeYamlFile } from '@bldr/file-reader-writer';
export function convertTextFileToYaml(txtFile, yamlFile) {
    let txtContent = readFile(txtFile);
    txtContent = txtContent.replace(/\f/g, '+---+');
    txtContent = txtContent.replace(/\s+/g, ' ');
    txtContent = txtContent.replace(/\s*\+---\+\s*/g, '\n---\n');
    txtContent = txtContent.replace(/- /g, '');
    writeYamlFile(yamlFile, { ocr: txtContent });
}
export default async function action(filePath) {
    // Musicassette-9-10_1991.pdf.yml -> Musicassette-9-10_1991.pdf
    filePath = filePath.replace(/\.yml$/, '');
    filePath = filePath.replace(/_preview\.jpg$/, '');
    const sidecarTxt = filePath.replace(/\.pdf$/, '.txt');
    await cliUtils.execute([
        'ocrmypdf',
        '--language',
        'deu+eng',
        '--rotate-pages',
        '--deskew',
        '--optimize',
        '3',
        '--jpeg-quality',
        '15',
        '--jbig2-lossy',
        '--force-ocr',
        '--rotate-pages-threshold',
        '5',
        '--sidecar',
        sidecarTxt,
        filePath,
        filePath.replace(/\.pdf$/, '_ocr.pdf')
    ]);
    convertTextFileToYaml(sidecarTxt, sidecarTxt + '.yml');
}
