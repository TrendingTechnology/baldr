// Node packages.
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const lib = require('../../lib.js')
const { getPdfPageCount } = require('@bldr/core-node')

/**
 * @param {String} tmpPdfFile
 * @param {Number} pageCount
 * @param {Number} pageNo
 */
function generateOneClozeSvg (tmpPdfFile, pageCount, pageNo) {
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
    [tmpPdfFile, svgFileName, pageNo],
    { cwd }
  )

  // Remove width="" and height="" attributes
  let svgContent = lib.readFile(svgFilePath)
  svgContent = svgContent.replace(/(width|height)=".+?" /g, '')
  lib.writeFile(svgFilePath, svgContent)

  // Write info yaml
  const titles = new mediaServer.HierarchicalFolderTitles(tmpPdfFile)
  const infoYaml = {
    id: `${titles.id}_LT${counterSuffix}`,
    title: `Lückentext zum Thema „${titles.title}“ (Seite ${pageNo} von ${pageCount})`,
    meta_types: 'cloze',
    cloze_page_no: pageNo,
    cloze_page_count: pageCount
  }
  lib.writeFile(path.join(cwd, `${svgFileName}.yml`), lib.yamlToTxt(infoYaml))

  // Move to LT (Lückentext) subdir.
  const newPath = mediaServer.locationIndicator.moveIntoSubdir(path.resolve(svgFileName), 'LT')
  lib.moveAsset(svgFilePath, newPath)
}

/**
 * @param {String} filePath
 */
function generateClozeSvg (filePath) {
  filePath = path.resolve(filePath)
  console.log(filePath)
  const cwd = path.dirname(filePath)
  let texFileContent = lib.readFile(filePath)
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
    function (match, p1, p2) {
      // match \documentclass[angabe,querformat]{schule-arbeitsblatt}
      // p1: [angabe,querformat]
      // p2: angabe,querformat
      let args = []
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
  lib.writeFile(tmpTexFile, texFileContent)
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
function action (filePath) {
  mediaServer.walk(
    generateClozeSvg,
    { regex: new RegExp('.*\.tex$'), path: filePath }
  ) // eslint-disable-line
}

module.exports = action
