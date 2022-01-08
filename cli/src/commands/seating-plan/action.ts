import { convertNotenmanagerMdbToJson } from '@bldr/seating-plan-converter'

export default async function action (mdbFile: string): Promise<any> {
  return await convertNotenmanagerMdbToJson(mdbFile)
}
