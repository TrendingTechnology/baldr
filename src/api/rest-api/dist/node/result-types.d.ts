/**
 * The number of assets and presentation documents in the MongoDB
 */
export interface MediaCount {
    assets: number;
    presentations: number;
}
export interface UpdateTask {
    begin: number;
    end: number;
    lastCommitId: string;
}
export interface MediaStatistics {
    count: MediaCount;
    updateTasks: UpdateTask[];
}
export interface MediaManagementUpdateResult extends UpdateTask {
    duration: number;
    errors: string[];
    count: MediaCount;
}
export { FlushMediaResult } from '@bldr/mongodb-connector';
