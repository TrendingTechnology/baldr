import * as cliUtils from '@bldr/cli-utils';
export default async function action(filePath) {
    // Musicassette-9-10_1991.pdf.yml -> Musicassette-9-10_1991.pdf
    filePath = filePath.replace(/\.yml$/, '');
    filePath = filePath.replace(/_preview.jpg/, '');
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
        filePath.replace(/\.pdf$/, '.txt'),
        filePath,
        filePath.replace(/\.pdf$/, '_ocr.pdf')
    ]);
}
