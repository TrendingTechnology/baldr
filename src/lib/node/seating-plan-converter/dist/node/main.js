"use strict";
/**
 * @module @bldr/seating-plan-converter
 */
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
exports.convertNotenmanagerMdbToJson = void 0;
// Node packages.
const fs_1 = __importDefault(require("fs"));
// Third party packages.
const csv_parser_1 = __importDefault(require("csv-parser"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const core_browser_1 = require("@bldr/core-browser");
const config_ng_1 = require("@bldr/config");
const config = (0, config_ng_1.getConfig)();
const documentTemplate = {
    grades: {},
    jobs: {
        Schaltwart: {
            icon: 'video-switch'
        },
        Austeilwart: {
            icon: 'file-outline'
        },
        Klassenbuchführer: {
            icon: 'notebook'
        },
        Klassensprecher: {
            icon: 'account-star'
        },
        Lüftwart: {
            icon: 'window-open'
        }
    },
    timeStampMsec: 0,
    meta: {
        location: config.meta.school,
        teacher: config.meta.teacher,
        year: (0, core_browser_1.getFormatedSchoolYear)()
    }
};
function convertNotenmanagerMdbToJson(mdbFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new cli_utils_1.CommandRunner();
        const result = yield cmd.exec(['mdb-export', mdbFile, 'Schüler']);
        if ((result === null || result === void 0 ? void 0 : result.stdout) != null) {
            (0, file_reader_writer_1.writeFile)('tmp.csv', result.stdout);
        }
        const grades = {};
        return yield new Promise(function (resolve, reject) {
            fs_1.default.createReadStream('tmp.csv')
                .pipe((0, csv_parser_1.default)())
                .on('data', row => {
                const data = row;
                if (grades[data.klasse] != null) {
                    grades[data.klasse][`${data.name}, ${data.vorname}`] = {};
                }
                else {
                    grades[data.klasse] = {};
                }
            })
                .on('end', () => {
                documentTemplate.grades = grades;
                documentTemplate.timeStampMsec = new Date().getTime();
                (0, file_reader_writer_1.writeFile)('seating-plan.json', JSON.stringify(documentTemplate, null, '  '));
                resolve(documentTemplate);
            });
        });
    });
}
exports.convertNotenmanagerMdbToJson = convertNotenmanagerMdbToJson;
