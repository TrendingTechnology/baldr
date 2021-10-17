import { operations } from '@bldr/media-manager'

interface CmdObj {
  wikidata: boolean
  parentPresDir: boolean
}

/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
async function action (filePaths: string[], cmdObj: CmdObj): Promise<void> {
  await operations.normalize(filePaths, cmdObj.parentPresDir)
}

export = action
