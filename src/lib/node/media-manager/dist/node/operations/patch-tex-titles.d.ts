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
export declare function patchTexTitles(filePath: string): boolean;
