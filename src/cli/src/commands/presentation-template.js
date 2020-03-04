// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const {
  walk
} = require('@bldr/api-media-server')
const {
  makeAsset,
  yamlToTxt
} = require('../lib.js')

const presentationTemplate = `---
meta:
  title:
  subtitle:
  id:
  grade:
  curriculum:
  curriculum_url:

slides:

- generic: Hello world
`

/**
 * Create a presentation template named “Praesentation.baldr.yml”.
 */
function presentationFromTemplate (filePath) {
  fs.writeFileSync(filePath, presentationTemplate)
}

/**
 * Create a Praesentation.baldr.yml file and insert all media assets in the
 * presentation.
 *
 * @param {String} filePath - The file path of the new created presentation
 *   template.
 */
async function presentationFromAssets (filePath) {
  const slides = []
  await walk(process.cwd(), {
    asset (relPath) {
      const asset = makeAsset(relPath)
      if (!asset.id) {
        console.log(`Asset has no ID: ${chalk.red(relPath)}`)
        return
      }
      console.log(asset)
      let masterName
      if (asset.id.indexOf('NB') > -1) {
        masterName = 'score_sample'
      } else {
        masterName = asset.assetType
      }
      slides.push(
        {
          [masterName]: `id:${asset.id}`
        }
      )
    }
  })
  const result = yamlToTxt({
    slides
  })
  console.log(result)
  fs.writeFileSync(filePath, result)
}

async function action (command) {
  let filePath = path.join(process.cwd(), 'Praesentation.baldr.yml')
  if (!fs.existsSync(filePath)) {
    console.log(`Presentation template created at: ${chalk.green(filePath)}`)
  } else {
    filePath = filePath.replace('.baldr.yml', '_tmp.baldr.yml')
    console.log(`Presentation already exists, create tmp file: ${chalk.red(filePath)}`)
  }

  if (command.fromAssets) {
    await presentationFromAssets(filePath)
  } else {
    presentationFromTemplate(filePath)
  }
}

module.exports = {
  command: 'presentation',
  alias: 'p',
  options: [
    ['-a, --from-assets', 'Create a presentation from the assets of the current working dir.']
  ],
  description: 'Create a presentation template named “Praesentation.baldr.yml”.',
  action
}
