// Project packages.
import { convertMdToTex } from '@bldr/tex-markdown-converter'
import { DeepTitle } from '@bldr/titles'
import { readFile, writeFile } from '@bldr/file-reader-writer'
import * as tex from '@bldr/tex-templates'

/**
 * @returns A TeX markup like this output:
 *
 * ```tex
 * \setzetitel{
 *   jahrgangsstufe = {6},
 *   ebenei = {Musik und ihre Grundlagen},
 *   ebeneii = {Systeme und Strukturen},
 *   ebeneiii = {die Tongeschlechter Dur und Moll},
 *   titel = {Dur- und Moll-Tonleiter},
 *   untertitel = {Das Lied \emph{„Kol dodi“} in Moll und Dur},
 * }
 * ```
 */
function makeTexMarkup (titles: DeepTitle): string {
  const setzeTitle: { [key: string]: string } = {
    jahrgangsstufe: titles.grade.toString()
  }

  const ebenen = ['ebenei', 'ebeneii', 'ebeneiii', 'ebeneiv', 'ebenev']
  for (let index = 0; index < titles.curriculumTitlesArrayFromGrade.length; index++) {
    setzeTitle[ebenen[index]] = titles.curriculumTitlesArrayFromGrade[index]
  }
  setzeTitle.titel = titles.title
  if (titles.subtitle != null) {
    setzeTitle.untertitel = titles.subtitle
  }

  // Replace semantic markup
  for (const key in setzeTitle) {
    setzeTitle[key] = convertMdToTex(setzeTitle[key])
  }

  return tex.cmd('setzetitel', '\n' + tex.keyValues(setzeTitle) + '\n') + '\n'
}

/**
 * ```tex
 * \setzetitel{
 *   jahrgangsstufe = {6},
 *   ebenei = {Musik und ihre Grundlagen},
 *   ebeneii = {Systeme und Strukturen},
 *   ebeneiii = {die Tongeschlechter Dur und Moll},
 *   titel = {Dur- und Moll-Tonleiter},
 *   untertitel = {Das Lied \emph{„Kol dodi“} in Moll und Dur},
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
    writeFile(filePath, texFileContentPatched)
    return true
  }
  return false
}
