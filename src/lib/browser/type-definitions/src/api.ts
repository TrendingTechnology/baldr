export interface Count {
  assets: number
  presentations: number
}

export interface Task {
  begin: number
  end: number
  lastCommitId: string
}

export interface UpdateResult extends Task {
  finished: boolean
  duration: number
  errors: string[]
  count: Count
}
