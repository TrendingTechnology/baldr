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
// Node packages.
const fs_1 = __importDefault(require("fs"));
// Third party packages.
const csv_parser_1 = __importDefault(require("csv-parser"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const media_manager_1 = require("@bldr/media-manager");
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
        location: 'Pirckheimer-Gymnasium, Nürnberg',
        teacher: 'OStR Josef Friedrich',
        year: '2019/20'
    }
};
/**
 * @param  mdbFile
 */
function action(mdbFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new cli_utils_1.CommandRunner();
        const result = yield cmd.exec(['mdb-export', mdbFile, 'Schüler']);
        if (result && result.stdout) {
            media_manager_1.writeFile('tmp.csv', result.stdout);
        }
        const grades = {};
        fs_1.default.createReadStream('tmp.csv')
            .pipe(csv_parser_1.default())
            .on('data', (data) => {
            if (grades[data.klasse]) {
                grades[data.klasse][`${data.name}, ${data.vorname}`] = {};
            }
            else {
                grades[data.klasse] = {};
            }
        })
            .on('end', () => {
            documentTemplate.grades = grades;
            documentTemplate.timeStampMsec = new Date().getTime();
            media_manager_1.writeFile('seating-plan.json', JSON.stringify(documentTemplate, null, '  '));
        });
    });
}
module.exports = action;
