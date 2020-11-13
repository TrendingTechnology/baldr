#! /usr/bin/env node

// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

// Node packages.
import fs from 'fs'
import path from 'path'
import os from 'os'

// Third party packages.
import chalk from 'chalk'
import webfont from 'webfont'

// Project packages.
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
  if (newName) {
    destName = newName
  } else {
    destName = name
  }
  const destination = path.join(tmpDir, `${destName}.svg`)
  await cmd.exec(['wget', '-O', destination, url])
  // console.log(`Download destination: ${chalk.green(destination)}`)
}

async function downloadIcons (iconMapping: IconFontMapping, urlTemplate: string): Promise<void> {
  cmd.startProgress()
  // console.log(`New download task using this template: ${chalk.red(urlTemplate)}`)
  const iconsCount = Object.keys(iconMapping).length
  let count = 0
  for (const oldName in iconMapping) {
    const url = urlTemplate.replace('{icon}', oldName)
    // console.log(`Download icon “${chalk.blue(icon)}” from “${chalk.yellow(url)}”`)
    let newName: string = oldName
    const iconDef: string | IconDefintion = iconMapping[oldName]
    if (typeof iconDef === 'string' && iconDef) {
      newName = iconDef
    } else if (typeof iconDef === 'object' && iconDef.newName) {
      newName = iconDef.newName
    }

    await downloadIcon(url, oldName, newName)
    count++
    cmd.updateProgress(count / iconsCount, `download icon “${chalk.blue(oldName)}”`)
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
      fs.copyFileSync(
        path.join(srcFolder, icon),
        path.join(destFolder, icon)
      )
      console.log(`Copy the file “${chalk.magenta(icon)}” from the destination folder “${chalk.green(icon)}” to the destination folder “${chalk.yellow(icon)}”.`)
    }
  }
}

function writeFileToDest (destFileName: string, content: string): void {
  const destPath = getIconPath(destFileName)
  fs.writeFileSync(destPath, content)
  console.log(`Create file: ${chalk.cyan(destPath)}`)
}

interface WebFontConfig {
  files: string,
  fontName: string,
  formats: string[],
  fontHeight: number,
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
        const name = glyphData.metadata.name
        names.push(name)
        const unicodeGlyph = glyphData.metadata.unicode[0]
        const cssUnicodeEscape = '\\' + unicodeGlyph.charCodeAt(0).toString(16)
        const cssGlyph = `.baldr-icon_${name}::before {
  content: "${cssUnicodeEscape}";
}
`
        css.push(cssGlyph)
        console.log(`name: ${chalk.red(name)} unicode glyph: ${chalk.yellow(unicodeGlyph)} unicode escape hex: ${chalk.green(cssUnicodeEscape)}`)
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
    if (task.urlTemplate) {
      await downloadIcons(task.iconMapping, task.urlTemplate)
    } else if (task.folder) {
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

function action (): void {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep))

  console.log(`The SVG files of the icons are download to: ${chalk.yellow(tmpDir)}`)

  buildFont([
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
