import path from 'path'

import { MediaCategory } from '@bldr/type-definitions'

export const abbreviations: { [key: string]: string } = {
  AB: 'Arbeitsblatt',
  BD: 'Bild',
  BS: 'Bekanntes Stück',
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

export function isValidTwoLetterAbbreviation (abbreviation: string): boolean {
  return abbreviations[abbreviation] != null
}

export function getTwoLetterAbbreviations (): string[] {
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
export function checkForTwoLetterDir (filePath: string): boolean {
  const pathSegments = filePath.split(path.sep)
  // HB
  const twoLetterDir = pathSegments[pathSegments.length - 2]
  // Match asset type abbreviations, like AB, HB, NB
  if (twoLetterDir != null && twoLetterDir.length === 2 && (twoLetterDir.match(/[A-Z]{2,}/) != null)) {
    return isValidTwoLetterAbbreviation(twoLetterDir)
  }
  return false
}

export function checkTypeAbbreviations (categoryCollection: MediaCategory.Collection): void {
  for (const name in categoryCollection) {
    const category = categoryCollection[name as MediaCategory.Name]

    if (category.abbreviation != null && !isValidTwoLetterAbbreviation(category.abbreviation)) {
      throw new Error(`Unkown two letter abbreviation ${category.abbreviation}`)
    }
  }
}
