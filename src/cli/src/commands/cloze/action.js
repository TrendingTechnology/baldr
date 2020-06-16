// Node packages.
const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const mediaServer = require('@bldr/media-server')
const lib = require('../../lib.js')
const { getPdfPageCount } = require('@bldr/core-node')

function generateClozeSvg (filePath) {
  filePath = path.resolve(filePath)
  console.log(filePath)
  const cwd = path.dirname(filePath)
  let texFileContent = lib.readFile(filePath)
  if (texFileContent.indexOf('cloze') === -1) {
    console.log(`${chalk.red(filePath)} has no cloze texts.`)
    return
  }

  console.log(`Generate SVGs from the file ${chalk.yellow(filePath)}.`)
  const jobName = path.basename(filePath).replace('.tex', '_Loesung')

  // Show cloze texts by patching the TeX file and generate a PDF file.
  texFileContent = texFileContent.replace(
    /^.*\n(.*)\n/,
    '%!TEX program = lualatex\n\\documentclass[loesung]{schule-arbeitsblatt}\n'
  )
  lib.writeFile(filePath, texFileContent)
  const result = childProcess.spawnSync(
    'lualatex', ['--shell-escape', '--jobname', jobName, filePath],
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
    let counterSuffix = ''
    if (pageCount > 1) {
      counterSuffix = `_${index}`
    }
    console.log(`Convert page ${chalk.green(index)}`)
    const svgFileName = `Lueckentext${counterSuffix}.svg`
    const svgFilePath = path.join(cwd, svgFileName)

    // Convert into SVG
    childProcess.spawnSync(
      'pdf2svg',
      [tmpPdfFile, svgFileName, index],
      { cwd }
    )

    // Remove width="" and height="" attributes
    let svgContent = lib.readFile(svgFilePath)
    svgContent = svgContent.replace(/(width|height)=".+?" /g, '')
    lib.writeFile(svgFilePath, svgContent)

    // Write info yaml
    const titles = new mediaServer.HierarchicalFolderTitles(filePath)
    const infoYaml = {
      id: `${titles.id}_LT${counterSuffix}`,
      title: `Lückentext zum Thema „${titles.title}“ (Seite ${index} von ${pageCount})`,
      meta_types: 'cloze',
      cloze_page_no: index,
      cloze_page_count: pageCount
    }
    lib.writeFile(path.join(cwd, `${svgFileName}.yml`), lib.yamlToTxt(infoYaml))

    // Move to LT (Lückentext) subdir.
    const newPath = mediaServer.locationIndicator.moveIntoSubdir(path.resolve(svgFileName), 'LT')
    lib.moveAsset(svgFilePath, newPath)
  }

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
