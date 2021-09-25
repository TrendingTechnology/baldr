// Project packages.
import { convertMdToTex } from '@bldr/tex-markdown-converter'
import { DeepTitle } from '@bldr/titles'
import { readFile, writeFile } from '@bldr/file-reader-writer'
import * as tex from '@bldr/tex-templates'
import * as log from '@bldr/log'

import { removeSpacesAtLineEnd } from './fix-typography'

/**
 * @returns A TeX markup like this output:
 *
 * ```tex
 * \setzetitel{
 *   Fach = Musik,
 *   Jahrgangsstufe = 6,
 *   Ebenen = {
 *     { Musik und ihre Grundlagen },
 *     { Systeme und Strukturen },
 *     { die Tongeschlechter Dur und Moll },
 *   },
 *   Titel = { Dur- und Moll-Tonleiter },
 *   Untertitel = { Das Lied \emph{„Kol dodi“} in Moll und Dur },
 * }
 * ```
 */
function makeTexMarkup (titles: DeepTitle): string {
  const setzeTitle: { [key: string]: string } = {
    Fach: titles.subject,
    Jahrgangsstufe: titles.grade.toString()
  }

  const ebenen = []
  for (const title of titles.curriculumTitlesArrayFromGrade) {
    ebenen.push(`    { ${title} },`)
  }
  setzeTitle.Ebenen = '\n' + ebenen.join('\n') + '\n '
  setzeTitle.Titel = titles.title
  if (titles.subtitle != null) {
    setzeTitle.Untertitel = titles.subtitle
  }

  // Replace semantic markup
  for (const key in setzeTitle) {
    setzeTitle[key] = convertMdToTex(setzeTitle[key])
  }

  const result =
    tex.cmd('setzetitel', '\n' + tex.keyValues(setzeTitle) + '\n') + '\n'
  return removeSpacesAtLineEnd(result)
}

/**
 * ```tex
 * \setzetitel{
 *   Fach = Musik,
 *   Jahrgangsstufe = 6,
 *   Ebenen = {
 *     { Musik und ihre Grundlagen },
 *     { Systeme und Strukturen },
 *     { die Tongeschlechter Dur und Moll },
 *   },
 *   Titel = { Dur- und Moll-Tonleiter },
 *   Untertitel = { Das Lied \emph{„Kol dodi“} in Moll und Dur },
 * }
 * ```
 *
 * @param filePath - The path of a TeX file.
 */
export function patchTexTitles (filePath: string): boolean {
  const titles = new DeepTitle(filePath)
  const patchedTitles = makeTexMarkup(titles)
  const texFileContent = readFile(filePath)
  let texFileContentPatched: string

  if (texFileContent.includes('\\setzetitel{')) {
    // /s s (dotall) modifier, +? one or more (non-greedy)
    const regexp = new RegExp(/\\setzetitel\{.+?,?\n\}\n/, 's')
    texFileContentPatched = texFileContent.replace(regexp, patchedTitles)
  } else {
    texFileContentPatched = texFileContent.replace(
      /(\\documentclass(\[.*\])?\{schule-arbeitsblatt\})/,
      '$1\n\n' + patchedTitles
    )
  }

  if (texFileContent !== texFileContentPatched) {
    log.info('Patch titles in TeX file %s', filePath)
    log.verbose(log.colorizeDiff(texFileContent, texFileContentPatched))
    writeFile(filePath, texFileContentPatched)
    return true
  }
  log.verbose('Nothing to patch in TeX file %s', filePath)
  return false
}
