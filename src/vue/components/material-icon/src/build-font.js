#! /usr/bin/env node

// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

// Node packages.
const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const os = require('os')

// Third party packages.
const chalk = require('chalk')
const webfont = require('webfont').default

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep))
const basePathDir = path.resolve(__dirname)

console.log(`The base dir is located at: ${chalk.yellow(tmpDir)}`)

function basePath () {
  return path.join(basePathDir, ...arguments)
}

function downloadIcon (url, name, newName) {
  let destName
  if (newName) {
    destName = newName
  } else {
    destName = name
  }
  const destination = path.join(tmpDir, `${destName}.svg`)
  childProcess.spawnSync('wget', ['-O', destination, url])
  console.log(`Download destination: ${chalk.green(destination)}`)
}

function downloadIcons (iconMapping, urlTemplate) {
  console.log(`New download task using this template: ${chalk.red(urlTemplate)}`)
  for (const icon in iconMapping) {
    const url = urlTemplate.replace('{icon}', icon)
    console.log(`Download icon “${chalk.blue(icon)}” from “${chalk.yellow(url)}”`)
    let newName
    if (iconMapping[icon]) {
      newName = iconMapping[icon]
    }
    downloadIcon(url, icon, newName)
  }
}

function copyIcons (srcFolder, destFolder) {
  const icons = fs.readdirSync(srcFolder)
  for (const icon of icons) {
    if (icons.includes('.svg') > -1) {
      fs.copyFileSync(
        path.join(srcFolder, icon),
        path.join(destFolder, icon)
      )
      console.log(`Copy the file “${chalk.magenta(icon)}” from the destination folder “${chalk.green(icon)}” to the destination folder “${chalk.yellow(icon)}”.`)
    }
  }
}

function writeFileToDest (destFileName, content) {
  const destPath = basePath(destFileName)
  fs.writeFileSync(destPath, content)
  console.log(`Create file: ${chalk.cyan(destPath)}`)
}

function buildFont (config) {
  webfont({
    files: `${tmpDir}/*.svg`,
    fontName: 'baldr-icons',
    formats: ['woff', 'woff2'],
    fontHeight: 512
  })
    .then(result => {
      const css = []
      const names = []

      const header = fs.readFileSync(basePath('style_header.css'), { encoding: 'utf-8' })
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
    .catch(error => {
      throw error
    })
}

function main (options) {
  for (const task of options) {
    if ('urlTemplate' in task) {
      downloadIcons(task.iconMapping, task.urlTemplate)
    } else if ('folder' in task) {
      copyIcons(task.folder, tmpDir)
    }
  }
  buildFont({
    files: `${tmpDir}/*.svg`,
    fontName: 'baldr-icons',
    formats: ['woff', 'woff2'],
    fontHeight: 512
  })
}

if (require.main === module) {
  main([
    {
      urlTemplate: 'https://raw.githubusercontent.com/Templarian/MaterialDesign/master/icons/svg/{icon}.svg',
      iconMapping: {
        'account-group': '',
        'account-plus': '',
        'account-star-outline': 'account-star',
        'air-filter': '',
        'arrow-left': '',
        'chevron-down': '',
        'chevron-left': '',
        'chevron-right': '',
        'chevron-up': '',
        'content-save': 'save',
        'dice-multiple': '',
        'file-image': '',
        'file-music': 'file-audio',
        'file-outline': '',
        'file-video': '',
        'google-spreadsheet': '',
        'open-in-new': '',
        'presentation-play': 'presentation',
        'seat-outline': '',
        'table-of-contents': '',
        'test-tube': '',
        'timeline-text': '',
        'video-switch': '',
        cctv: '',
        close: '',
        cloud: '',
        delete: '',
        export: '',
        import: '',
        magnify: '',
        music: '',
        notebook: '',
        wikipedia: '',
        worker: '',
        youtube: ''
      }
    },
    {
      folder: basePath('icons'),
      iconMapping: {
        baldr: '',
        musescore: '',
        wikidata: ''
      }
    }
  ])
}
