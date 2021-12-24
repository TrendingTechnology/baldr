/**
 * The number of assets and presentation documents in the MongoDB
 */
export interface MediaStatisticsCountResult {
    assets: number;
    presentations: number;
}
export interface Task {
    begin: number;
    end: number;
    lastCommitId: string;
}
export interface MediaManagementUpdateResult extends Task {
    duration: number;
    errors: string[];
    count: MediaStatisticsCountResult;
}
