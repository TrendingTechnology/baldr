// Project packages.
import { operations, walk } from '@bldr/media-manager'

/**
 * Replace the title section of the TeX files with metadata retrieved
 * from the title.txt files.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 */
async function action (filePaths: string[]): Promise<void> {
  await walk(operations.patchTexTitles, {
    path: filePaths,
    regex: 'tex'
  })
}

export = action
