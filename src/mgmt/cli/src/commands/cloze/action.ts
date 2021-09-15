// Node packages.
import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

// Project packages.
import * as log from '@bldr/log'
import {
  moveAsset,
  operations,
  locationIndicator,
  walk
} from '@bldr/media-manager'
import { DeepTitle } from '@bldr/titles'
import { convertToYaml } from '@bldr/yaml'
import { getPdfPageCount } from '@bldr/core-node'
import { readFile, writeFile } from '@bldr/file-reader-writer'

async function generateOneClozeSvg (
  tmpPdfFile: string,
  pageCount: number,
  pageNo: number
): Promise<void> {
  const cwd = path.dirname(tmpPdfFile)
  let counterSuffix = ''
  if (pageCount > 1) {
    counterSuffix = `_${pageNo}`
  }
  log.info('Convert page %s', pageNo)
  const svgFileName = `Lueckentext${counterSuffix}.svg`
  const svgFilePath = path.join(cwd, svgFileName)

  // Convert into SVG
  childProcess.spawnSync(
    'pdf2svg',
    [tmpPdfFile, svgFileName, pageNo.toString()],
    { cwd }
  )

  // Remove width="" and height="" attributes
  let svgContent = readFile(svgFilePath)
  svgContent = svgContent.replace(/(width|height)=".+?" /g, '')
  writeFile(svgFilePath, svgContent)

  // Write info yaml
  const titles = new DeepTitle(tmpPdfFile)
  const infoYaml = {
    ref: `${titles.ref}_LT${counterSuffix}`,
    title: `Lückentext zum Thema „${titles.title}“ (Seite ${pageNo} von ${pageCount})`,
    meta_types: 'cloze',
    cloze_page_no: pageNo,
    cloze_page_count: pageCount
  }
  writeFile(path.join(cwd, `${svgFileName}.yml`), convertToYaml(infoYaml))

  // Move to LT (Lückentext) subdir.
  const newPath = locationIndicator.moveIntoSubdir(
    path.resolve(svgFileName),
    'LT'
  )
  log.info('Result svg: %s has no cloze texts.', newPath)
  moveAsset(svgFilePath, newPath)
  await operations.normalizeMediaAsset(newPath, { wikidata: false })
}

/**
 * @param filePath - The file path of a TeX file.
 */
async function generateClozeSvg (filePath: string): Promise<void> {
  filePath = path.resolve(filePath)
  const cwd = path.dirname(filePath)
  let texFileContent = readFile(filePath)
  if (!texFileContent.includes('cloze')) {
    log.info('%s has no cloze texts.', filePath)
    return
  }

  const tmpTexFile = filePath.replace('.tex', '_Loesung.tex')

  log.info('Generate SVGs from the file %s.', filePath)
  const jobName = path.basename(tmpTexFile).replace('.tex', '')
  // Show cloze texts by patching the TeX file and generate a PDF file.
  // \documentclass[angabe,querformat]{schule-arbeitsblatt}
  texFileContent = texFileContent.replace(
    /\\documentclass(\[(.*)\])?\{schule-arbeitsblatt\}/,
    function (match: string, p1: string, p2: string) {
      // match \documentclass[angabe,querformat]{schule-arbeitsblatt}
      // p1: [angabe,querformat]
      // p2: angabe,querformat
      let args: string[] = []
      let isSolutionSet = false
      if (p2 != null) {
        args = p2.split(',')
        for (let index = 0; index < args.length; index++) {
          if (args[index] === 'angabe') {
            args[index] = 'loesung'
            isSolutionSet = true
          }
        }
        if (args.includes('loesung')) {
          isSolutionSet = true
        }
      }
      if (!isSolutionSet) {
        args.push('loesung')
      }
      return `\\documentclass[${args.join(',')}]{schule-arbeitsblatt}`
    }
  )
  writeFile(tmpTexFile, texFileContent)
  const result = childProcess.spawnSync(
    'lualatex',
    ['--shell-escape', tmpTexFile],
    { cwd, encoding: 'utf-8' }
  )

  if (result.status !== 0) {
    console.log(result.stdout)
    console.log(result.stderr)
    throw new Error('lualatex compilation failed.')
  }

  const tmpPdfFile = path.join(cwd, `${jobName}.pdf`)
  const pageCount = getPdfPageCount(tmpPdfFile)

  for (let index = 1; index <= pageCount; index++) {
    await generateOneClozeSvg(tmpPdfFile, pageCount, index)
  }
  fs.unlinkSync(tmpTexFile)
  fs.unlinkSync(tmpPdfFile)
}

/**
 * Generate from TeX files with cloze texts SVGs for baldr.
 */
async function action (filePath: string): Promise<void> {
  await walk(
    generateClozeSvg,
    { regex: new RegExp('.*.tex$'), path: filePath } // eslint-disable-line
  )
}

module.exports = action
