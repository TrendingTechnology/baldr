// Node packages.
const childProcess = require('child_process')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const {
  HierarchicalFolderTitles,
  walkDeluxe
} = require('@bldr/api-media-server')
const {
  readFile,
  writeFile,
  yamlToTxt
} = require('../lib.js')

function generateClozeSvg (filePath) {
  const cwd = path.dirname(filePath)
  let texFileContent = readFile(filePath)
  if (texFileContent.indexOf('cloze') === -1) {
    console.log(`${chalk.red(filePath)} has no cloze texts.`)
    return
  }

  console.log(`Generate SVGs from the file ${chalk.yellow(filePath)}.`)
  const jobName = 'Arbeitsblatt_Loesung'

  // Show cloze texts by patching the TeX file and generate a PDF file.
  texFileContent = texFileContent.replace(
    /^.*\n(.*)\n/,
    '%!TEX program = lualatex\n\\documentclass[loesung]{schule-arbeitsblatt}\n'
  )
  writeFile(filePath, texFileContent)
  childProcess.spawnSync(
    'lualatex', ['--shell-escape', '--jobname', jobName, filePath],
    { cwd }
  )

  const process = childProcess.spawnSync(
    'pdfinfo', [`${jobName}.pdf`],
    { encoding: 'utf-8', cwd }
  )

  const pageCount = parseInt(process.stdout.match(/Pages:\s+(\d+)/)[1])

  for (let index = 1; index <= pageCount; index++) {
    let counterSuffix = ''
    if (pageCount > 1) {
      counterSuffix = `_${index}`
    }
    console.log(`Convert page ${chalk.green(index)}`)
    const svgFileName = `${jobName}${counterSuffix}.svg`
    const svgFilePath = path.join(cwd, svgFileName)

    // Convert into SVG
    childProcess.spawnSync(
      'pdf2svg',
      [`${jobName}.pdf`, svgFileName, index],
      { cwd }
    )

    // Remove width="" and height="" attributes
    let svgContent = readFile(svgFilePath)
    svgContent = svgContent.replace(/(width|height)=".+?" /g, '')
    writeFile(svgFilePath, svgContent)

    // Write info yaml
    const titles = new HierarchicalFolderTitles(filePath)
    const infoYaml = {
      id: `${titles.id}_AB_Lueckentext${counterSuffix}`,
      title: `Arbeitsblatt „${titles.title}“ (Lückentext Seite ${index} von ${pageCount})`
    }
    writeFile(path.join(cwd, `${svgFileName}.yml`), yamlToTxt(infoYaml))
  }
}

/**
 * Generate from TeX files with cloze texts SVGs for baldr.
 */
function action (filePath) {
  walkDeluxe(generateClozeSvg, new RegExp('.*\.tex$'), filePath)
}

module.exports = {
  command: 'cloze [input]',
  alias: 'c',
  checkExecutable: ['pdfinfo', 'pdf2svg', 'lualatex'],
  description: 'Generate from TeX files with cloze texts SVGs for baldr.',
  action
}
