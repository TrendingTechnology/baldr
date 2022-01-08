import { isModuleMain } from '@bldr/core-node';
import { startRestApi } from './api';
export { startRestApi as start } from './api';
export { default as openArchivesInFileManager } from './operations/open-archives-in-file-manager';
export { default as restart } from './operations/restart-systemd-service';
async function main() {
    let port;
    if (process.argv.length === 3) {
        port = parseInt(process.argv[2]);
    }
    return await startRestApi(port);
}
if (isModuleMain(import.meta)) {
    main()
        .then()
        .catch(reason => console.log(reason));
}
