// Node packages.
import fs from 'fs'
import path from 'path'

// Project packages.
import { objectifyTexItemize, objectifyTexZitat } from '@bldr/tex-markdown-converter'
import { readFile, writeFile } from '@bldr/core-node'

import { makeAsset } from '../media-file-classes'
import { yamlToTxt } from '../yaml'
import { walk } from '../directory-tree-walk'

type SlideData = { [key: string]: any }

/**
 * @param {String} masterName
 * @param {Array|Object} data
 */
function slidify (masterName: string, data: SlideData[] | SlideData, topLevelData: SlideData): SlideData[] {
  function slidifySingle (masterName: string, data: SlideData): SlideData {
    const slide: SlideData = {}
    slide[masterName] = data
    if (topLevelData) Object.assign(slide, topLevelData)
    return slide
  }

  if (Array.isArray(data)) {
    const result = []
    for (const item of data) {
      result.push(slidifySingle(masterName, item))
    }
    return result
  } else {
    return [slidifySingle(masterName, data)]
  }
}

/**
 * Create a Praesentation.baldr.yml file and insert all media assets in
 * the presentation.
 *
 * @param filePath - The file path of the new created presentation
 *   template.
 */
export async function generatePresentation (filePath: string): Promise<void> {
  const basePath = path.dirname(filePath)
  let slides: SlideData[] = []
  await walk({
    asset (relPath) {
      const asset = makeAsset(relPath)
      if (!asset.id) {
        return
      }
      let masterName: string = 'generic'
      if (asset.id.indexOf('_LT') > -1) {
        masterName = 'cloze'
      } else if (asset.id.indexOf('NB') > -1) {
        masterName = 'score_sample'
      } else if (asset.mediaCategory) {
        masterName = asset.mediaCategory
      }
      slides.push(
        <SlideData> {
          [masterName]: `id:${asset.id}`
        }
      )
    }
  }, { path: basePath })

  const notePath = path.join(basePath, 'Hefteintrag.tex')
  if (fs.existsSync(notePath)) {
    const noteContent = readFile(notePath)
    slides = slides.concat(slidify('note', objectifyTexItemize(noteContent), { source: 'Hefteintrag.tex' }))
  }

  const worksheetPath = path.join(basePath, 'Arbeitsblatt.tex')
  if (fs.existsSync(worksheetPath)) {
    const worksheetContent = readFile(worksheetPath)
    slides = slides.concat(slidify('quote', objectifyTexZitat(worksheetContent), { source: 'Arbeitsblatt.tex' }))
  }

  const result = yamlToTxt({
    slides
  })
  console.log(result)
  writeFile(filePath, result)
}
