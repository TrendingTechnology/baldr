import path from 'path'

import { MetaSpec } from '@bldr/type-definitions'

const abbreviations: { [key: string]: string } = {
  AB: 'Arbeitsblatt',
  BD: 'Bild',
  EP: 'Example',
  FT: 'Foto',
  GN: 'Graphische Notation',
  GR: 'Gruppe',
  HB: 'Hörbeispiel',
  IN: 'Instrument',
  LD: 'Song / Lied',
  LT: 'Lückentext',
  NB: 'Notenbeispiel',
  PR: 'Person',
  PT: 'Partitur',
  QL: 'Quelle',
  SF: 'Schulfunk',
  TX: 'TeX-Dateien',
  VD: 'Video-Datei',
  YT: 'YouTube-Video'
}

export function isValidTwoLetterAbbreviation(abbreviation: string): boolean {
  return abbreviations[abbreviation] ? true : false
}

export function getTwoLetterAbbreviations(): string[] {
  return Object.keys(abbreviations)
}

/**
 * Check if the given file path is in a valid two letter directory.
 *
 * @param filePath A file path, for example
 * `../30_Funktionen-Filmmusik/HB/Bach_Aria-Orchestersuite.m4a.yml`
 *
 * @return True if the file path is in a valid two letter directory, else false.
 */
export function checkForTwoLetterDir(filePath: string): boolean {
  const pathSegments = filePath.split(path.sep)
  // HB
  const twoLetterDir = pathSegments[pathSegments.length - 2]
  // Match asset type abbreviations, like AB, HB, NB
  if (twoLetterDir.length == 2 || twoLetterDir.match(/[A-Z]{2,}/)) {
    return isValidTwoLetterAbbreviation(twoLetterDir)
  }
  return false
}

export function checkTypeAbbreviations(typeSpecs: MetaSpec.TypeCollection) {
  for (const typeName in typeSpecs) {
    const typeSpec = typeSpecs[<MetaSpec.TypeName>typeName]

    if (typeSpec.abbreviation && !isValidTwoLetterAbbreviation(typeSpec.abbreviation)) {
      throw new Error(`Unkown two letter abbreviation ${typeSpec.abbreviation}`)
    }
  }
}
