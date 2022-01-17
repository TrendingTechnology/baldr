/**
 * @module @bldr/icon-font-generator
 */
// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

import { Configuration, getConfig } from '@bldr/config'
import { IconTypes } from '@bldr/type-definitions'

import fs from 'fs'
import path from 'path'

import { webfont } from 'webfont'

// Project packages.
import { CommandRunner } from '@bldr/cli-utils'
import { createTmpDir } from '@bldr/node-utils'
import { readJsonFile, writeJsonFile } from '@bldr/file-reader-writer'
import * as log from '@bldr/log'

const config = getConfig()

const cmd = new CommandRunner()

/**
 * For the tests. To see whats going on. The test runs very long.
 */
export const setLogLevel = log.setLogLevel

/**
 * Download one icon.
 *
 * @param url - The URL to download a icon.
 * @param destDir - The destination directory where the icon should be stored.
 * @param newName - The new name of the icon.
 */
function downloadIcon (url: string, destDir: string, newName: string): void {
  log.info('Download icon %s from %s', [newName, url])
  cmd.execSync(['wget', '-O', path.join(destDir, `${newName}.svg`), url])
}

/**
 * Download all icons.
 *
 * @param destDir - The destination directory where the icon should be stored.
 */
function downloadIcons (
  iconMapping: IconTypes.IconFontMapping,
  urlTemplate: string,
  destDir: string
): void {
  cmd.startProgress()
  const iconsCount = Object.keys(iconMapping).length
  let count = 0
  for (const newName in iconMapping) {
    const iconDef = iconMapping[newName]

    if (iconDef.materialName != null) {
      const url = urlTemplate.replace('{icon}', iconDef.materialName)

      downloadIcon(url, destDir, newName)
      count++
      cmd.updateProgress(
        count / iconsCount,
        log.format('download icon “%s”', [newName])
      )
    }
  }
  cmd.stopProgress()
}

/**
 * Copy svg icons for a source folder to a destination folder.
 *
 * @param srcFolder - The source folder.
 * @param destDir - The destination folder.
 */
function copyIcons (
  iconMapping: IconTypes.IconFontMapping,
  srcFolder: string,
  destDir: string
): void {
  for (const newName in iconMapping) {
    const iconDef = iconMapping[newName]

    if (iconDef.fileName != null) {
      const src = path.join(srcFolder, iconDef.fileName)
      const dest = path.join(destDir, `${newName}.svg`)
      fs.copyFileSync(src, dest)
      log.info(
        'Copy the file “%s” from the source folder “%s” to the destination folder “%s”.',
        [iconDef.fileName, src, dest]
      )
    }
  }
}

function writeFile (destPath: string, content: string): void {
  fs.writeFileSync(destPath, content)
  log.verbose('Create file: %s', [destPath])
}

function writeBuffer (destPath: string, content?: Buffer): void {
  if (content == null) {
    return
  }
  fs.writeFileSync(destPath, content)
  log.verbose('Create file: %s', [destPath])
}

interface GlyphMetadata {
  /**
   * `/tmp/CiSTWO/musicbrainz-recording.svg`
   */
  path: string

  /**
   * `musicbrainz-recording`
   */
  name: string

  /**
   * `[ '', 'musicbrainz_recording' ]`
   * [unicodeCharacter: string, glyphName: string]
   */
  unicode: string[]

  /**
   * `false`
   */
  renamed: boolean

  /**
   * `512`
   */
  width: number

  /**
   * `512`
   */
  height: number
}

const cssStyleHeader = `
@font-face {
  font-family: "Baldr Icons";
  src: url("./baldr-icons.woff2") format("woff2"), url("./baldr-icons.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

.baldr-icon,
.baldr-icon::before {
  display: inline-block;
  font: normal normal normal 24px/1 "Baldr Icons";
  font-size: inherit;
  text-rendering: auto;
  line-height: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.baldr-icon-spin:before {
  animation: baldr-icon-spin 4s infinite linear;
}

@keyframes baldr-icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
`

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
  output.push(cssStyleHeader)
  for (const glyphData of metadataCollection) {
    const unicodeGlyph: string = glyphData.unicode[0]
    const unicode = '\\' + unicodeGlyph.charCodeAt(0).toString(16)
    const glyph = `.baldr-icon_${glyphData.name}::before {\n  content: "${unicode}";\n}\n`
    output.push(glyph)
  }
  writeFile(path.join(destDir, 'style.css'), output.join('\n'))
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
  log.infoAny(config)

  try {
    const result = await webfont({
      files: `${tmpDir}/*.svg`,
      fontName: 'baldr-icons',
      formats: ['woff', 'woff2', 'ttf'],
      fontHeight: 512,
      descent: 64
    })
    log.infoAny(result)

    if (result.glyphsData == null) {
      throw new Error('No glyphs data found.')
    }

    const metadataCollection: GlyphMetadata[] = []
    for (const glyphData of result.glyphsData) {
      const metadata: GlyphMetadata = glyphData.metadata as GlyphMetadata
      metadataCollection.push(metadata)
    }

    createCssFile(metadataCollection, destDir)
    createJsonFile(metadataCollection, destDir)
    patchConfig(metadataCollection, destDir)

    writeBuffer(path.join(destDir, 'baldr-icons.ttf'), result.ttf)
    writeBuffer(path.join(destDir, 'baldr-icons.woff'), result.woff)
    writeBuffer(path.join(destDir, 'baldr-icons.woff2'), result.woff2)
  } catch (error) {
    log.errorAny(error)
    throw error
  }
}

function patchConfig (
  metadataCollection: GlyphMetadata[],
  destPath: string
): void {
  // to get a fresh unpatched version
  const configJson = readJsonFile(config.configurationFileLocations[1])

  // Don’t update the configuration file when testing.
  if (configJson.iconFont.destPath !== destPath) {
    return
  }
  const assigment: { [glyphName: string]: number } = {}
  for (const glyphData of metadataCollection) {
    assigment[glyphData.name] = glyphData.unicode[0].charCodeAt(0)
  }

  configJson.iconFont.unicodeAssignment = assigment

  for (const filePath of config.configurationFileLocations) {
    log.info('Patch configuration file %s', [filePath])
    writeJsonFile(filePath, configJson)
  }
}

export async function createIconFont (
  config: Configuration,
  tmpDir: string
): Promise<void> {
  log.info(
    'The SVG files of the icons are downloaded to this temporary directory: %s',
    [tmpDir]
  )

  downloadIcons(
    config.iconFont.iconMapping,
    config.iconFont.urlTemplate,
    tmpDir
  )
  copyIcons(
    config.iconFont.iconMapping,
    config.iconFont.additionalIconsPath,
    tmpDir
  )
  await convertIntoFontFiles(tmpDir, config.iconFont.destPath)
}

async function action (): Promise<void> {
  await createIconFont(config, createTmpDir())
}

export default action
