var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { validateMediaType } from '../utils';
import openFileManager from '../operations/open-file-manager';
import openEditor from '../operations/open-editor';
import updateMedia from '../operations/update-media';
import { database } from '../api';
import * as query from '../query';
export default function () {
    const app = express();
    // Update the media server
    app.put('/', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            response.json(yield updateMedia(false));
        }
        catch (error) {
            next(error);
        }
    }));
    // Statistics
    app.get('/', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = {
                count: yield database.getDocumentCounts(),
                updateTasks: yield database.listUpdateTasks()
            };
            response.json(result);
        }
        catch (error) {
            next(error);
        }
    }));
    // flush
    app.delete('/', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            response.json(yield database.flushMediaFiles());
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/presentations/by-:scheme/:authority', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (request.params.scheme !== 'ref' &&
                request.params.scheme !== 'uuid') {
                throw new Error('Scheme has to be “ref” or “uuid”');
            }
            response.json(yield database.getPresentation(request.params.scheme, request.params.authority));
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/get/presentations/by-substring', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const search = query.extractString(request.query, 'search');
            response.json(yield database.searchPresentationBySubstring(search));
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/assets/by-:scheme/:authority', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (request.params.scheme !== 'ref' && request.params.scheme !== 'uuid') {
                throw new Error('Scheme has to be “ref” or “uuid”');
            }
            response.json(yield database.getAsset(request.params.scheme, request.params.authority));
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/assets/refs', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            response.json(yield database.getAllAssetRefs());
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/assets/uuids', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            response.json(yield database.getAllAssetUuids());
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/assets/uris', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            response.json(yield database.getAllAssetUris());
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/titles', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            response.json(yield database.getFolderTitleTree());
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/open/editor', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const ref = query.extractString(request.query, 'ref');
            const type = validateMediaType(query.extractString(request.query, 'type', 'presentation'));
            const dryRun = query.extractBoolean(request.query, 'dry-run', false);
            response.json(yield openEditor(ref, type, dryRun));
        }
        catch (error) {
            next(error);
        }
    }));
    app.get('/open/file-manager', (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const ref = query.extractString(request.query, 'ref');
            const type = validateMediaType(query.extractString(request.query, 'type'));
            const create = query.extractBoolean(request.query, 'create', false);
            const archive = query.extractBoolean(request.query, 'archive', false);
            const dryRun = query.extractBoolean(request.query, 'dry-run', false);
            response.json(yield openFileManager(ref, type, archive, create, dryRun));
        }
        catch (error) {
            next(error);
        }
    }));
    return app;
}
