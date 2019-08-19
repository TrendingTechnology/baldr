#! /usr/bin/env node

// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const os = require('os')

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep))

const chalk = require('chalk')
const webfont = require('webfont').default

const basePathDir = path.resolve(__dirname)

// const customIcons = [
//   'baldr',
//   'musescore',
//   'wikidata'
// ]

const materialDesignIcons = [
  'account-group',
  'account-plus',
  'account-star-outline',
  'air-filter',
  'arrow-left',
  'cctv',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'close',
  'cloud',
  'content-save',
  'delete',
  'dice-multiple',
  'export',
  'file-outline',
  'google-spreadsheet',
  'import',
  'magnify',
  'music',
  'notebook',
  'open-in-new',
  'seat-outline',
  'table-of-contents',
  'test-tube',
  'timeline-text',
  'video-switch',
  'wikipedia',
  'worker',
  'youtube'
]

console.log(`The base dir is located at: ${chalk.yellow(tmpDir)}`)

function basePath () {
  return path.join(basePathDir, ...arguments)
}

function downloadIcon (url, name) {
  childProcess.spawnSync('wget', ['-O', path.join(tmpDir, `${name}.svg`), url])
}

for (const icon of materialDesignIcons) {
  const url = `https://raw.githubusercontent.com/Templarian/MaterialDesign/master/icons/svg/${icon}.svg`
  console.log(`Download icon “${chalk.blue(icon)}” from “${chalk.yellow(url)}”`)
  downloadIcon(url, icon)
}

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
    fs.writeFileSync(basePath('style.css'), css.join('\n'), { encoding: 'utf-8' })
    fs.writeFileSync(basePath('baldr-icons.woff'), result.woff)
    fs.writeFileSync(basePath('baldr-icons.woff2'), result.woff2)
    fs.writeFileSync(basePath('icons.json'), JSON.stringify(names, null, '  '))
    return result
  })
  .catch(error => {
    throw error
  })
