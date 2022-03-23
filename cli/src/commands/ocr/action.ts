import * as cliUtils from '@bldr/cli-utils'
import { readFile, writeYamlFile } from '@bldr/file-reader-writer'

export default async function action (filePath: string): Promise<void> {
  // Musicassette-9-10_1991.pdf.yml -> Musicassette-9-10_1991.pdf
  filePath = filePath.replace(/\.yml$/, '')
  filePath = filePath.replace(/_preview\.jpg$/, '')

  const sidecarTxt = filePath.replace(/\.pdf$/, '.txt')

  // await cliUtils.execute([
  //   'ocrmypdf',
  //   '--language',
  //   'deu+eng',
  //   '--rotate-pages',
  //   '--deskew',
  //   '--optimize',
  //   '3',
  //   '--jpeg-quality',
  //   '15',
  //   '--jbig2-lossy',
  //   '--force-ocr',
  //   '--rotate-pages-threshold',
  //   '5',
  //   '--sidecar',
  //   sidecarTxt,
  //   filePath,
  //   filePath.replace(/\.pdf$/, '_ocr.pdf')
  // ])

  let txtContent = readFile(sidecarTxt)

  txtContent = txtContent.replace(/\f/g, '+---+')
  txtContent = txtContent.replace(/\s+/g, ' ')

  txtContent = txtContent.replace(/\s*\+---\+\s*/g, '\n---\n')
  txtContent = txtContent.replace(/- /g, '')

  writeYamlFile(sidecarTxt + '.yml', { ocr: txtContent })
}
