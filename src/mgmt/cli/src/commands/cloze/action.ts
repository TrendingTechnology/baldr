// Node packages.
import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { moveAsset, operations, locationIndicator, DeepTitle, walk } from '@bldr/media-manager'
import { convertObjectToYamlString } from '@bldr/core-browser'
import { getPdfPageCount, readFile, writeFile } from '@bldr/core-node'

function generateOneClozeSvg (tmpPdfFile: string, pageCount: number, pageNo: number) {
  const cwd = path.dirname(tmpPdfFile)
  let counterSuffix = ''
  if (pageCount > 1) {
    counterSuffix = `_${pageNo}`
  }
  console.log(`Convert page ${chalk.green(pageNo)}`)
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
    id: `${titles.id}_LT${counterSuffix}`,
    title: `Lückentext zum Thema „${titles.title}“ (Seite ${pageNo} von ${pageCount})`,
    meta_types: 'cloze',
    cloze_page_no: pageNo,
    cloze_page_count: pageCount
  }
  writeFile(path.join(cwd, `${svgFileName}.yml`), convertObjectToYamlString(infoYaml))

  // Move to LT (Lückentext) subdir.
  const newPath = locationIndicator.moveIntoSubdir(path.resolve(svgFileName), 'LT')
  moveAsset(svgFilePath, newPath)
  operations.normalizeMediaAsset(newPath, { wikidata: false })
}

/**
 * @param {String} filePath
 */
function generateClozeSvg (filePath: string) {
  filePath = path.resolve(filePath)
  console.log(filePath)
  const cwd = path.dirname(filePath)
  let texFileContent = readFile(filePath)
  if (texFileContent.indexOf('cloze') === -1) {
    console.log(`${chalk.red(filePath)} has no cloze texts.`)
    return
  }

  const tmpTexFile = filePath.replace('.tex', '_Loesung.tex')

  console.log(`Generate SVGs from the file ${chalk.yellow(filePath)}.`)
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
      if (p2) {
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
    'lualatex', ['--shell-escape', tmpTexFile],
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
    generateOneClozeSvg(tmpPdfFile, pageCount, index)
  }
  fs.unlinkSync(tmpTexFile)
  fs.unlinkSync(tmpPdfFile)
}

/**
 * Generate from TeX files with cloze texts SVGs for baldr.
 */
function action (filePath: string) {
  walk(
    generateClozeSvg,
    { regex: new RegExp('.*\.tex$'), path: filePath }
  ) // eslint-disable-line
}

module.exports = action
