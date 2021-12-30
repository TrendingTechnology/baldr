/**
 * The number of assets and presentation documents in the MongoDB
 */
export interface MediaCount {
  assets: number
  presentations: number
}

export interface MediaUpdateTask {
  begin: number
  end: number
  lastCommitId: string
}

export interface MediaStatistics {
  count: MediaCount
  updateTasks: MediaUpdateTask[]
}

export interface MediaUpdateResult extends MediaUpdateTask {
  duration: number
  errors: string[]
  count: MediaCount
}

export interface DbDroppedCollections {
  /**
   * The names of the dropped MongoDB collections.
   */
  droppedCollections: string[]
}

export interface DbCollectionInitResult {
  name: string
  indexes: {
    [indexName: string]: string
  }
}

export interface DbInitResult {
  [collectionName: string]: DbCollectionInitResult
}

export interface DbReInitResult {
  resultDrop: DbDroppedCollections
  resultInit: DbInitResult
}

export interface DynamikSelectResult {
  ref: string
  name: string
}

export type MediaType = 'asset' | 'presentation'

export interface OpenEditorResult {
  ref: string
  mediaType: MediaType
  absPath: string
  parentFolder: string
  editor: string
}

export interface OpenFileManagerResult {
  ref: string
  absPath: string
  parentFolders: string[]
  mediaType: MediaType
  openArchiveFolder: boolean
  createParentDir: boolean
}

export interface OpenInFileManagerResult {
  fileManager: string
  filePath: string
  parentDir: string
  opened: boolean
  createdParentDir: boolean
}
