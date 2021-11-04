import { operations } from '@bldr/media-manager'

interface Options {
  presentation?: boolean
  tex?: boolean
  asset?: boolean
}

/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
async function action (filePaths: string[], opts?: Options): Promise<void> {
  let filter

  if (opts?.presentation ?? false) {
    filter = 'presentation' as const
  } else if (opts?.tex ?? false) {
    filter = 'tex' as const
  } else if (opts?.asset ?? false) {
    filter = 'asset' as const
  }

  await operations.normalize(filePaths, filter)
}

export = action
