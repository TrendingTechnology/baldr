const webfont = require('webfont').default
const fs = require('fs')
// const path = require('path')

// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js

webfont({
  files: 'icons/*.svg',
  fontName: 'baldr-icons',
  formats: ['woff', 'woff2'],
  fontHeight: 512
})
  .then(result => {
    // console.log(result)
    // console.log(result.glyphsData[0].metadata)
    for (const glyphData of result.glyphsData) {
      console.log(glyphData.metadata)
    }
    fs.writeFileSync('baldr-icons.woff', result.woff)
    fs.writeFileSync('baldr-icons.woff2', result.woff2)
    return result
  })
  .catch(error => {
    throw error
  })
