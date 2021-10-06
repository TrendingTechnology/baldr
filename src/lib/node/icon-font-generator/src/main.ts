/**
 * @module @bldr/icon-font-generator
 */
// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

import { IconFontGeneratorTypes } from '@bldr/type-definitions'

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

/**
 * Download one icon.
 *
 * @param url - The URL to download a icon.
 * @param destDir - The destination directory where the icon should be stored.
 * @param oldName - The old original name of the Material Design icons project.
 * @param newName - The new name of the icon.
 */
function downloadIcon (
  url: string,
  destDir: string,
  oldName: string,
  newName?: string
): void {
  let destName: string
  if (newName != null && newName !== '') {
    destName = newName
  } else {
    destName = oldName
  }
  log.info('Download icon %s from %s', destName, url)
  cmd.execSync(['wget', '-O', path.join(destDir, `${destName}.svg`), url])
}

/**
 * Download all icons.
 *
 * @param iconMapping
 * @param urlTemplate
 * @param destDir - The destination directory where the icon should be stored.
 */
function downloadIcons (
  iconMapping: IconFontGeneratorTypes.IconFontMapping,
  urlTemplate: string,
  destDir: string
): void {
  cmd.startProgress()
  const iconsCount = Object.keys(iconMapping).length
  let count = 0
  for (const newName in iconMapping) {
    let oldName: string = newName

    const iconDef: false | string | IconFontGeneratorTypes.IconDefintion =
      iconMapping[newName]
    if (typeof iconDef === 'string') {
      oldName = iconDef
    } else if (typeof iconDef === 'object' && iconDef.oldName != null) {
      oldName = iconDef.oldName
    }
    const url = urlTemplate.replace('{icon}', oldName)

    downloadIcon(url, destDir, oldName, newName)
    count++
    cmd.updateProgress(
      count / iconsCount,
      log.format('download icon “%s”', newName)
    )
  }
  cmd.stopProgress()
}

/**
 * Copy svg icons for a source folder to a destination folder.
 *
 * @param srcFolder - The source folder.
 * @param destFolder - The destination folder.
 */
function copyIcons (srcFolder: string, destFolder: string): void {
  const icons = fs.readdirSync(srcFolder)
  for (const icon of icons) {
    if (icon.includes('.svg')) {
      const src = path.join(srcFolder, icon)
      const dest = path.join(destFolder, icon)
      fs.copyFileSync(src, dest)
      log.info(
        'Copy the file “%s” from the source folder “%s” to the destination folder “%s”.',
        icon,
        src,
        dest
      )
    }
  }
}

function writeFile (destPath: string, content: string): void {
  fs.writeFileSync(destPath, content)
  log.verbose('Create file: %s', destPath)
}

function writeBuffer (destPath: string, content?: Buffer): void {
  if (content == null) {
    return
  }
  fs.writeFileSync(destPath, content)
  log.verbose('Create file: %s', destPath)
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
 *
 * @param metadataCollection - An array of glyph metadata.
 * @param destDir - A path to a destination directory.
 */
function createCssFile (
  metadataCollection: GlyphMetadata[],
  destDir: string
): void {
  const output = []
  const header = fs.readFileSync(
    path.join(config.iconFont.distPath, 'style_header.css'),
    {
      encoding: 'utf-8'
    }
  )
  output.push(header)
  for (const glyphData of metadataCollection) {
    const unicodeGlyph: string = glyphData.unicode[0]
    const unicode = '\\' + unicodeGlyph.charCodeAt(0).toString(16)
    const glyph = `.baldr-icon_${glyphData.name}::before {\n  content: "${unicode}";\n}\n`
    output.push(glyph)
  }
  writeFile(path.join(destDir, 'style.css'), output.join('\n'))
}

/**
 * ```tex
 * \def\bIconTask{{\BaldrIconFont\char"0EA3A}}
 * ```
 *
 * @param metadataCollection - An array of glyph metadata.
 * @param destDir - A path to a destination directory.
 */
function createTexFile (
  metadataCollection: GlyphMetadata[],
  destDir: string
): void {
  const output = []
  for (const glyphData of metadataCollection) {
    const unicodeGlyph: string = glyphData.unicode[0]
    const unicode = unicodeGlyph
      .charCodeAt(0)
      .toString(16)
      .toUpperCase()
    const name = glyphData.name.replace(/(-[a-z])/g, group =>
      group.toUpperCase().replace('-', '')
    )
    const glyph = `\\def\\bIcon${toTitleCase(
      name
    )}{{\\BaldrIconFont\\char"0${unicode}}}`
    output.push(glyph)
  }
  writeFile(path.join(destDir, 'baldr-icons-macros.tex'), output.join('\n'))
}

/**
 * @param metadataCollection - An array of glyph metadata.
 * @param destDir - A path to a destination directory.
 */
function createJsonFile (
  metadataCollection: GlyphMetadata[],
  destDir: string
): void {
  const output = []
  for (const glyphData of metadataCollection) {
    output.push(glyphData.name)
  }
  writeFile(
    path.join(destDir, 'icons.json'),
    JSON.stringify(output, null, '  ')
  )
}

async function convertIntoFontFiles (
  tmpDir: string,
  destDir: string
): Promise<void> {
  log.info(config)

  try {
    const result = await webfont({
      files: `${tmpDir}/*.svg`,
      fontName: 'baldr-icons',
      formats: ['woff', 'woff2', 'ttf'],
      fontHeight: 512,
      descent: 64
    })
    log.info(result)

    if (result.glyphsData == null) {
      throw new Error('No glyphs data found.')
    }

    const metadataCollection: GlyphMetadata[] = []
    for (const glyphData of result.glyphsData) {
      const metadata: GlyphMetadata = glyphData.metadata as GlyphMetadata
      metadataCollection.push(metadata)
    }

    createCssFile(metadataCollection, destDir)
    createTexFile(metadataCollection, destDir)
    createJsonFile(metadataCollection, destDir)

    writeBuffer(path.join(destDir, 'baldr-icons.ttf'), result.ttf)
    writeBuffer(path.join(destDir, 'baldr-icons.woff'), result.woff)
    writeBuffer(path.join(destDir, 'baldr-icons.woff2'), result.woff2)
  } catch (error) {
    log.error(error)
    throw error
  }
}

async function action (): Promise<void> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep))

  log.info(
    'The SVG files of the icons are downloaded to this temporary directory: %s',
    tmpDir
  )

  downloadIcons(
    config.iconFont.iconMapping,
    config.iconFont.urlTemplate,
    tmpDir
  )
  copyIcons(path.join(config.iconFont.distPath, 'icons'), tmpDir)
  await convertIntoFontFiles(tmpDir, config.iconFont.distPath)
}

export default action
