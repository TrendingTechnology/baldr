#! /usr/bin/env node

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
import { IconFontMapping, IconFontConfiguration, IconDefintion } from '@bldr/type-definitions'

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
  return path.join(config.localRepo, 'src', 'icons', 'src', ...arguments)
}

async function downloadIcon (url: string, name: string, newName: string): Promise<void> {
  let destName: string
  if (newName != null) {
    destName = newName
  } else {
    destName = name
  }
  const destination = path.join(tmpDir, `${destName}.svg`)
  await cmd.exec(['wget', '-O', destination, url])
}

async function downloadIcons (iconMapping: IconFontMapping, urlTemplate: string): Promise<void> {
  cmd.startProgress()
  const iconsCount = Object.keys(iconMapping).length
  let count = 0
  for (const oldName in iconMapping) {
    const url = urlTemplate.replace('{icon}', oldName)
    let newName: string = oldName
    const iconDef: string | IconDefintion = iconMapping[oldName]
    if (iconDef != null && typeof iconDef === 'string') {
      newName = iconDef
    } else if (typeof iconDef === 'object' && iconDef.newName != null) {
      newName = iconDef.newName
    }

    await downloadIcon(url, oldName, newName)
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

function convertIntoFontFiles (config: WebFontConfig): void {
  console.log(config)
  webfont(config)
    .then((result: { [key: string]: any }) => {
      console.log(result)
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
      writeFileToDest('baldr-icons.woff', result.woff)
      writeFileToDest('baldr-icons.woff2', result.woff2)
      writeFileToDest('icons.json', JSON.stringify(names, null, '  '))
      return result
    })
    .catch((error: Error) => {
      console.log(error)
      throw error
    })
}

async function buildFont (options: IconFontConfiguration[]): Promise<void> {
  for (const task of options) {
    if (task.urlTemplate != null) {
      await downloadIcons(task.iconMapping, task.urlTemplate)
    } else if (task.folder != null) {
      copyIcons(task.folder, tmpDir)
    }
  }
  convertIntoFontFiles({
    files: `${tmpDir}/*.svg`,
    fontName: 'baldr-icons',
    formats: ['woff', 'woff2'],
    fontHeight: 512,
    descent: 64
  })
}

async function action (): Promise<void> {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep))

  log.info('The SVG files of the icons are download to: %s', tmpDir)

  await buildFont([
    config.iconFont,
    {
      folder: getIconPath('icons'),
      // iconMapping not used
      iconMapping: {
        baldr: '',
        musescore: '',
        wikidata: '',
        'document-camera': '',
        // Google icon „overscan“, not downloadable via github?
        fullscreen: ''
      }
    }
  ])
}

export = action
