// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

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
import { IconFontMapping, IconDefintion } from '@bldr/type-definitions'

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

function downloadIcon (url: string, name: string, newName: string): void {
  let destName: string
  if (newName != null && newName !== '') {
    destName = newName
  } else {
    destName = name
  }
  cmd.execSync(['wget', '-O', path.join(tmpDir, `${destName}.svg`), url])
}

function downloadIcons (iconMapping: IconFontMapping, urlTemplate: string): void {
  cmd.startProgress()
  const iconsCount = Object.keys(iconMapping).length
  let count = 0
  for (const oldName in iconMapping) {
    const url = urlTemplate.replace('{icon}', oldName)
    let newName: string = oldName
    const iconDef: false | string | IconDefintion = iconMapping[oldName]
    if (typeof iconDef === 'string') {
      newName = iconDef
    } else if (typeof iconDef === 'object' && iconDef.newName != null) {
      newName = iconDef.newName
    }

    downloadIcon(url, oldName, newName)
    count++
    cmd.updateProgress(count / iconsCount, log.format('download icon “%s”', oldName))
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

interface WebFontConfig {
  files: string
  fontName: string
  formats: string[]
  fontHeight: number
  descent: number
}

async function convertIntoFontFiles (config: WebFontConfig): Promise<void> {
  log.info(config)

  try {
    const result = await webfont(config)
    log.info(result)

    const css = []
    const names = []

    const header = fs.readFileSync(getIconPath('style_header.css'), { encoding: 'utf-8' })
    css.push(header)

    for (const glyphData of result.glyphsData) {
      const name: string = glyphData.metadata.name
      names.push(name)
      const unicodeGlyph: string = glyphData.metadata.unicode[0]
      const cssUnicodeEscape = '\\' + unicodeGlyph.charCodeAt(0).toString(16)
      const cssGlyph = `.baldr-icon_${name}::before {
content: "${cssUnicodeEscape}";
}
`
      css.push(cssGlyph)
      log.info('name: %s unicode glyph: %s unicode escape hex: %s', name, unicodeGlyph, cssUnicodeEscape)
    }
    writeFileToDest('style.css', css.join('\n'))
    writeFileToDest('baldr-icons.ttf', result.ttf)
    writeFileToDest('baldr-icons.woff', result.woff)
    writeFileToDest('baldr-icons.woff2', result.woff2)
    writeFileToDest('icons.json', JSON.stringify(names, null, '  '))
    return result
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

export = action
