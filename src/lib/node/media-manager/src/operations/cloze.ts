// Node packages.
import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

// Project packages.
import * as log from '@bldr/log'
import { moveAsset, operations } from '../main'

import { locationIndicator } from '../location-indicator'

import { DeepTitle } from '@bldr/titles'
import { convertToYaml } from '@bldr/yaml'
import { getPdfPageCount } from '@bldr/core-node'
import { readFile, writeFile } from '@bldr/file-reader-writer'

function initializeMetaYaml (
  pdfFile: string,
  dest: string,
  pageNo: number,
  pageCount: number
): void {
  // Write info yaml
  const titles = new DeepTitle(pdfFile)
  const infoYaml = {
    ref: `${titles.ref}_LT_${pageNo}`,
    title: `Lückentext zum Thema „${titles.title}“ (Seite ${pageNo} von ${pageCount})`,
    meta_types: 'cloze',
    cloze_page_no: pageNo,
    cloze_page_count: pageCount
  }
  const yamlContent = convertToYaml(infoYaml)
  log.debug(yamlContent)
  writeFile(dest, yamlContent)
}

async function generateSvg (
  tmpPdfFile: string,
  destDir: string,
  pageCount: number,
  pageNo: number
): Promise<void> {
  log.info('Convert page %s from %s', pageNo.toString(), pageCount.toString())
  const svgFileName = `${pageNo}.svg`
  const svgFilePath = path.join(destDir, svgFileName)

  fs.mkdirSync(destDir, { recursive: true })

  // Convert into SVG
  childProcess.spawnSync(
    'pdf2svg',
    [tmpPdfFile, svgFileName, pageNo.toString()],
    { cwd: destDir }
  )

  // Remove width="" and height="" attributes
  let svgContent = readFile(svgFilePath)
  svgContent = svgContent.replace(/(width|height)=".+?" /g, '')
  writeFile(svgFilePath, svgContent)
  // Move to LT (Lückentext) subdir.
  const destPath = path.join(destDir, svgFileName)

  initializeMetaYaml(tmpPdfFile, `${destPath}.yml`, pageNo, pageCount)

  log.info('Result svg: %s', destPath)
  moveAsset(svgFilePath, destPath)
  await operations.normalizeMediaAsset(destPath, { wikidata: false })
}

function patchTex (content: string): string {
  // Show cloze texts by patching the TeX file and generate a PDF file.
  // \documentclass[angabe,querformat]{schule-arbeitsblatt}
  return content.replace(
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
}

function compileTex (tmpTexFile: string): string {
  const jobName = path.basename(tmpTexFile).replace('.tex', '')

  const tmpDir = path.dirname(tmpTexFile)
  const result = childProcess.spawnSync(
    'lualatex',
    ['--shell-escape', tmpTexFile],
    { cwd: tmpDir, encoding: 'utf-8' }
  )

  if (result.status !== 0) {
    if (result.stdout != null) {
      log.error(result.stdout)
    }

    if (result.stderr != null) {
      log.error(result.stderr)
    }
    throw new Error('lualatex compilation failed.')
  }

  const tmpPdf = path.join(tmpDir, `${jobName}.pdf`)
  log.debug('Compiled to temporary PDF: %s', tmpPdf)
  return tmpPdf
}

/**
 * @param filePath - The file path of a TeX file.
 */
export async function generateCloze (
  filePath: string,
  logLevel: number
): Promise<void> {
  log.setLogLevel(5)
  filePath = path.resolve(filePath)
  const texFileContent = readFile(filePath)
  if (!texFileContent.includes('cloze')) {
    log.warn('%s has no cloze texts.', filePath)
    return
  }

  log.debug('Resolved input path: %s', filePath)

  // Move to LT (Lückentext) subdir.
  const parentDir = locationIndicator.getPresParentDir(filePath)
  if (parentDir == null) {
    throw new Error('Parent dir couldn’t be detected!')
  }
  const destDir = path.join(parentDir, 'LT')

  const tmpTexFile = filePath.replace('.tex', '_Loesung.tex')
  log.debug('Create temporary file %s', tmpTexFile)

  writeFile(tmpTexFile, patchTex(texFileContent))

  log.info('Generate SVGs from the file %s.', tmpTexFile)

  const tmpPdfFile = compileTex(tmpTexFile)
  const pageCount = getPdfPageCount(tmpPdfFile)

  for (let pageNo = 1; pageNo <= pageCount; pageNo++) {
    await generateSvg(tmpPdfFile, destDir, pageCount, pageNo)
  }
  fs.unlinkSync(tmpTexFile)
  fs.unlinkSync(tmpPdfFile)
}
