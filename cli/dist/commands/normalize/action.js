import { operations } from '@bldr/media-manager';
/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
export default async function action(filePaths, opts) {
    let filter;
    if (opts?.presentation ?? false) {
        filter = 'presentation';
    }
    else if (opts?.tex ?? false) {
        filter = 'tex';
    }
    else if (opts?.asset ?? false) {
        filter = 'asset';
    }
    await operations.normalize(filePaths, filter);
}
