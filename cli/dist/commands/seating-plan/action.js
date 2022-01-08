import { convertNotenmanagerMdbToJson } from '@bldr/seating-plan-converter';
export default async function action(mdbFile) {
    return await convertNotenmanagerMdbToJson(mdbFile);
}
