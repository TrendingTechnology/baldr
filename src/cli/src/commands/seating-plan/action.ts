
import { convertNotenmanagerMdbToJson } from '@bldr/seating-plan-converter'

async function action (mdbFile: string): Promise<any> {
  return await convertNotenmanagerMdbToJson(mdbFile)
}

export = action
