import { MediaManagementUpdateResult } from '../result-types';
/**
 * Update the media server.
 *
 * @param full - Update with git pull.
 *
 * @returns {Promise.<Object>}
 */
export default function (full?: boolean): Promise<MediaManagementUpdateResult>;
