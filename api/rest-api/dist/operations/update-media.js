var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from 'path';
import childProcess from 'child_process';
import fs from 'fs';
import { walk } from '@bldr/media-manager';
import { writeJsonFile } from '@bldr/file-reader-writer';
import { TreeFactory } from '@bldr/titles';
import { getConfig } from '@bldr/config';
import { buildPresentationData, buildDbAssetData } from '@bldr/media-data-collector';
import { database } from '../api';
const config = getConfig();
class ErrorMessageCollector {
    constructor() {
        /**
         * A container array for all error messages send out via the REST API.
         */
        this.messages = [];
    }
    addError(filePath, error) {
        const e = error;
        console.log(error);
        let relPath = filePath.replace(config.mediaServer.basePath, '');
        relPath = relPath.replace(/^\//, '');
        // eslint-disable-next-line
        const msg = `${relPath}: [${e.name}] ${e.message}`;
        console.log(msg);
        this.messages.push(msg);
    }
}
function insertMediaFileIntoDb(filePath, mediaType, errors) {
    return __awaiter(this, void 0, void 0, function* () {
        let media;
        try {
            if (mediaType === 'presentations') {
                media = buildPresentationData(filePath);
            }
            else if (mediaType === 'assets') {
                // Now only with meta data yml. Fix problems with PDF lying around.
                if (!fs.existsSync(`${filePath}.yml`)) {
                    return;
                }
                media = buildDbAssetData(filePath);
            }
            if (media == null) {
                return;
            }
            yield database.db.collection(mediaType).insertOne(media);
        }
        catch (error) {
            errors.addError(filePath, error);
        }
    });
}
/**
 * Run git pull on the `basePath`
 */
function gitPull() {
    const gitPull = childProcess.spawnSync('git', ['pull'], {
        cwd: config.mediaServer.basePath,
        encoding: 'utf-8'
    });
    if (gitPull.status !== 0) {
        throw new Error('git pull exits with an non-zero status code.');
    }
}
/**
 * Update the media server.
 *
 * @param full - Update with git pull.
 *
 * @returns {Promise.<Object>}
 */
export default function (full = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = new ErrorMessageCollector();
        const titleTreeFactory = new TreeFactory();
        if (full) {
            gitPull();
        }
        const gitRevParse = childProcess.spawnSync('git', ['rev-parse', 'HEAD'], {
            cwd: config.mediaServer.basePath,
            encoding: 'utf-8'
        });
        let assetCounter = 0;
        let presentationCounter = 0;
        const lastCommitId = gitRevParse.stdout.replace(/\n$/, '');
        yield database.connect();
        yield database.initialize();
        yield database.flushMediaFiles();
        const begin = new Date().getTime();
        yield database.db.collection('updates').insertOne({ begin: begin, end: 0 });
        yield walk({
            everyFile: filePath => {
                // Delete temporary files.
                if (filePath.match(/\.(aux|out|log|synctex\.gz|mscx,)$/) != null ||
                    filePath.includes('Praesentation_tmp.baldr.yml') ||
                    filePath.includes('title_tmp.txt')) {
                    fs.unlinkSync(filePath);
                }
            },
            directory: filePath => {
                // Delete empty directories.
                if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                    const files = fs.readdirSync(filePath);
                    if (files.length === 0) {
                        fs.rmdirSync(filePath);
                    }
                }
            },
            presentation: (filePath) => __awaiter(this, void 0, void 0, function* () {
                yield insertMediaFileIntoDb(filePath, 'presentations', errors);
                titleTreeFactory.addTitleByPath(filePath);
                presentationCounter++;
            }),
            asset: (filePath) => __awaiter(this, void 0, void 0, function* () {
                yield insertMediaFileIntoDb(filePath, 'assets', errors);
                assetCounter++;
            })
        }, {
            path: config.mediaServer.basePath
        });
        // .replaceOne and upsert: Problems with merged objects?
        yield database.db.collection('folderTitleTree').deleteOne({ ref: 'root' });
        const tree = titleTreeFactory.getTree();
        yield database.db.collection('folderTitleTree').insertOne({
            ref: 'root',
            tree
        });
        writeJsonFile(path.join(config.mediaServer.basePath, 'title-tree.json'), tree);
        const end = new Date().getTime();
        yield database.db
            .collection('updates')
            .updateOne({ begin: begin }, { $set: { end: end, lastCommitId } });
        return {
            begin,
            end,
            duration: end - begin,
            lastCommitId,
            errors: errors.messages,
            count: {
                assets: assetCounter,
                presentations: presentationCounter
            }
        };
    });
}
