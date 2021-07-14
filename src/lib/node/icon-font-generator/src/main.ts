/**
 * @module @bldr/icon-font-generator
 */
// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

import type { IconFontGeneratorTypes } from '@bldr/type-definitions'

// Node packages.
import fs from 'fs'
import path from 'path'
import os from 'os'

// Third party packages.
import webfont from 'webfont'

// Project packages.
import * as log from '@bldr/log'
import { CommandRunner } from '@bldr/cli-utils'
import config from '@bldr/config'
import { toTitleCase } from '@bldr/core-browser'

const cmd = new CommandRunner()

let tmpDir: string

/**
 * Get the absolute path inside the `src/icons/src/` folder
 *
 * @param args Multiple path segents.
 *
 * @returns An absolute path.
 */
function getIconPath (...args: string[]): string {
  return path.join(config.localRepo, 'src', 'vue', 'components', 'icons', 'src', ...arguments)
}

function downloadIcon (url: string, oldName: string, newName: string): void {
  let destName: string
  if (newName != null && newName !== '') {
    destName = newName
  } else {
    destName = oldName
  }
  log.info('Download icon %s from %s', destName, url)
  cmd.execSync(['wget', '-O', path.join(tmpDir, `${destName}.svg`), url])
}

function downloadIcons (iconMapping: IconFontGeneratorTypes.IconFontMapping, urlTemplate: string): void {
  cmd.startProgress()
  const iconsCount = Object.keys(iconMapping).length
  let count = 0
  for (const newName in iconMapping) {
    let oldName: string = newName

    const iconDef: false | string | IconFontGeneratorTypes.IconDefintion = iconMapping[newName]
    if (typeof iconDef === 'string') {
      oldName = iconDef
    } else if (typeof iconDef === 'object' && iconDef.oldName != null) {
      oldName = iconDef.oldName
    }
    const url = urlTemplate.replace('{icon}', oldName)

    downloadIcon(url, oldName, newName)
    count++
    cmd.updateProgress(count / iconsCount, log.format('download icon “%s”', newName))
  }
  cmd.stopProgress()
}

/**
 * Copy svg icons for a source folder to a destination folder.
 *
 * @param srcFolder The source folder.
 * @param destFolder The destination folder.
 */
function copyIcons (srcFolder: string, destFolder: string): void {
  const icons = fs.readdirSync(srcFolder)
  for (const icon of icons) {
    if (icon.includes('.svg')) {
      const src = path.join(srcFolder, icon)
      const dest = path.join(destFolder, icon)
      fs.copyFileSync(src, dest)
      log.info('Copy the file “%s” from the source folder “%s” to the destination folder “%s”.', icon, src, dest)
    }
  }
}

function writeFileToDest (destFileName: string, content: string): void {
  const destPath = getIconPath(destFileName)
  fs.writeFileSync(destPath, content)
  log.info('Create file: %s', destPath)
}

function writeBufferFileToDest (destFileName: string, content?: Buffer): void {
  if (content == null) {
    return
  }
  const destPath = getIconPath(destFileName)
  fs.writeFileSync(destPath, content)
  log.info('Create file: %s', destPath)
}

type Format = "eot" | "woff" | "woff2" | "svg" | "ttf";

interface WebFontConfig {
  files: string
  fontName: string
  formats: Format[]
  fontHeight: number
  descent: number
}

interface GlyphMetadata {
  path: string
  name: string
  unicode: string[]
  renamed: boolean
  width: number
  height: number
}

/**
 * ```css
 * .baldr-icon_account-group::before {
 *   content: "\ea01";
 * }
 * ```
 */
function createCssFile (metadataCollection: GlyphMetadata[]) {
  const output = []
  const header = fs.readFileSync(getIconPath('style_header.css'), { encoding: 'utf-8' })
  output.push(header)
  for (const glyphData of metadataCollection) {
      const unicodeGlyph: string = glyphData.unicode[0]
      const unicode = '\\' + unicodeGlyph.charCodeAt(0).toString(16)
      const glyph = `.baldr-icon_${glyphData.name}::before {\n  content: "${unicode}";\n}\n`
      output.push(glyph)
  }
  writeFileToDest('style.css', output.join('\n'))
}

/**
 * ```tex
 * \def\bIconTask{{\BaldrIconFont\char"0EA3A}}
 * ```
 */
 function createTexFile (metadataCollection: GlyphMetadata[]) {
  const output = []
  for (const glyphData of metadataCollection) {
      const unicodeGlyph: string = glyphData.unicode[0]
      const unicode = unicodeGlyph.charCodeAt(0).toString(16).toUpperCase()
      const name =  glyphData.name.replace(
        /(-[a-z])/g,
        (group) => group.toUpperCase().replace('-', '')
      )
      const glyph = `\\def\\bIcon${toTitleCase(name)}{{\\BaldrIconFont\\char"0${unicode}}}`
      output.push(glyph)
  }
  writeFileToDest('baldr-icons-macros.tex', output.join('\n'))
}

function createJsonFile (metadataCollection: GlyphMetadata[]) {
  const output = []
  for (const glyphData of metadataCollection) {
    output.push(glyphData.name)
  }
  writeFileToDest('icons.json', JSON.stringify(output, null, '  '))
}

async function convertIntoFontFiles (config: WebFontConfig): Promise<void> {
  log.info(config)

  try {
    const result = await webfont(config)
    log.info(result)

    if (result.glyphsData == null) {
      throw new Error('No glyphs data found.')
    }

    const metadataCollection: GlyphMetadata[] = []
    for (const glyphData of result.glyphsData) {
      const metadata: GlyphMetadata = glyphData.metadata as GlyphMetadata
      metadataCollection.push(metadata)
    }

    createCssFile(metadataCollection)
    createTexFile(metadataCollection)
    createJsonFile(metadataCollection)

    writeBufferFileToDest('baldr-icons.ttf', result.ttf)
    writeBufferFileToDest('baldr-icons.woff', result.woff)
    writeBufferFileToDest('baldr-icons.woff2', result.woff2)
  } catch (error) {
    log.error(error)
    throw error
  }
}

async function action (): Promise<void> {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep))

  log.info('The SVG files of the icons are downloaded to this temporary directory: %s', tmpDir)

  downloadIcons(config.iconFont.iconMapping, config.iconFont.urlTemplate)
  copyIcons(getIconPath('icons'), tmpDir)
  await convertIntoFontFiles({
    files: `${tmpDir}/*.svg`,
    fontName: 'baldr-icons',
    formats: ['woff', 'woff2', 'ttf'],
    fontHeight: 512,
    descent: 64
  })
}

export default action
