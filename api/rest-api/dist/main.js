var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isModuleMain } from '@bldr/core-node';
import { startRestApi } from './api';
export { startRestApi as start } from './api';
export { default as openArchivesInFileManager } from './operations/open-archives-in-file-manager';
export { default as restart } from './operations/restart-systemd-service';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let port;
        if (process.argv.length === 3) {
            port = parseInt(process.argv[2]);
        }
        return yield startRestApi(port);
    });
}
if (isModuleMain(import.meta)) {
    main()
        .then()
        .catch(reason => console.log(reason));
}
