#! /usr/bin/env node

// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const webfont = require('webfont').default

const basePathDir = path.resolve(__dirname)

console.log(`The base dir is located at: ${chalk.yellow(basePathDir)}`)

function basePath () {
  return path.join(basePathDir, ...arguments)
}

webfont({
  files: `${basePathDir}/icons/*.svg`,
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
      const cssGlyph = `.baldr-icons-${name}::before {
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
