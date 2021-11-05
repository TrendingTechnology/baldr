export interface UpdateResult {
  finished: boolean
  begin: number
  end: number
  duration: number
  lastCommitId: string
  errors: string[]
  count: {
    assets: number
    presentations: number
  }
}
