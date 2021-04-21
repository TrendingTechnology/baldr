"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const config_1 = __importDefault(require("@bldr/config"));
const http_request_1 = require("@bldr/http-request");
const localHttpRequest = http_request_1.makeHttpRequestInstance(config_1.default, 'local', '/api/media');
//const remoteHttpRequest = makeHttpRequestInstance(config, 'remote', '/api/media')
let httpRequest = localHttpRequest;
function runTests() {
    it('/api/media/mgmt/update', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield httpRequest.request('mgmt/update');
            assert_1.default.strictEqual(result.data.finished, true);
            assert_1.default.ok(typeof result.data.begin === 'number');
            assert_1.default.ok(typeof result.data.end === 'number');
            assert_1.default.ok(typeof result.data.duration === 'number');
            assert_1.default.ok(typeof result.data.lastCommitId === 'string');
            assert_1.default.ok(Array.isArray(result.data.errors));
            assert_1.default.strictEqual(result.data.errors.length, 0);
        });
    });
    it('/media/query?type=assets&field=id&method=exactMatch&search=IN_Cembalo', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield httpRequest.request({
                url: 'query',
                params: {
                    type: 'assets',
                    field: 'id',
                    method: 'exactMatch',
                    search: 'IN_Cembalo'
                }
            });
            const data = result.data;
            assert_1.default.strictEqual(data.id, 'IN_Cembalo');
            assert_1.default.strictEqual(data.uuid, '0f741f26-f861-4c17-a4a4-c12dcd8375d9');
            assert_1.default.strictEqual(data.wikidata, 'Q81982');
        });
    });
    it('/media/query?type=assets&field=uuid&method=exactMatch&search=c64047d2-983d-4009-a35f-02c95534cb53', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield httpRequest.request({
                url: 'query',
                params: {
                    type: 'assets',
                    field: 'uuid',
                    method: 'exactMatch',
                    search: 'c64047d2-983d-4009-a35f-02c95534cb53'
                }
            });
            const data = result.data;
            assert_1.default.strictEqual(data.composer, 'Modest Petrowitsch Mussorgski');
            assert_1.default.strictEqual(data.uuid, 'c64047d2-983d-4009-a35f-02c95534cb53');
        });
    });
    it('/media/query?type=presentations&field=id&method=exactMatch&search=Marmotte', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield httpRequest.request({
                url: 'query',
                params: {
                    type: 'presentations',
                    field: 'id',
                    method: 'exactMatch',
                    search: 'Marmotte'
                }
            });
            const data = result.data;
            assert_1.default.strictEqual(data.meta.id, 'Marmotte');
            assert_1.default.ok(typeof data.path === 'string');
            assert_1.default.ok(typeof data.filename === 'string');
        });
    });
    it('/media/query?type=presentations&field=id&method=exactMatch&search=Marmotte', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield httpRequest.request({
                url: 'query',
                params: {
                    type: 'presentations',
                    field: 'id',
                    method: 'exactMatch',
                    search: 'Marmotte'
                }
            });
            assert_1.default.strictEqual(result.data.meta.id, 'Marmotte');
            assert_1.default.ok(typeof result.data.path === 'string');
            assert_1.default.ok(typeof result.data.filename === 'string');
        });
    });
    it('/media/query?type=assets&field=path&method=substringSearch&search=Ausstellung&result=fullObjects', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield httpRequest.request({
                url: 'query',
                params: {
                    type: 'assets',
                    field: 'path',
                    method: 'substringSearch',
                    search: 'Ausstellung',
                    result: 'fullObjects'
                }
            });
            assert_1.default.ok(typeof result.data[0].uuid === 'string');
        });
    });
    it('/media/query?type=assets&field=path&method=substringSearch&search=Ausstellung&result=dynamicSelect', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield httpRequest.request({
                url: 'query',
                params: {
                    type: 'assets',
                    field: 'path',
                    method: 'substringSearch',
                    search: 'Ausstellung',
                    result: 'dynamicSelect'
                }
            });
            assert_1.default.ok(!result.data[0].uuid);
            assert_1.default.ok(result.data[0].id);
            assert_1.default.ok(result.data[0].name);
        });
    });
    it('/media/stats/count', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield httpRequest.request('stats/count');
            assert_1.default.ok(result.data.assets > 0);
            assert_1.default.ok(result.data.presentations > 0);
        });
    });
}
httpRequest = localHttpRequest;
describe('local: /api/media', runTests);
// httpRequest = remoteHttpRequest
// describe('remote: /api/media', runTests)
