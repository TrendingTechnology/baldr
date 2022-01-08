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
import fs from 'fs';
import csv from 'csv-parser';
// Project packages.
import { CommandRunner } from '@bldr/cli-utils';
import { writeFile } from '@bldr/file-reader-writer';
import { getFormatedSchoolYear } from '@bldr/core-browser';
import { getConfig } from '@bldr/config';
const config = getConfig();
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
        year: getFormatedSchoolYear()
    }
};
export function convertNotenmanagerMdbToJson(mdbFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new CommandRunner();
        const result = yield cmd.exec(['mdb-export', mdbFile, 'Schüler']);
        if ((result === null || result === void 0 ? void 0 : result.stdout) != null) {
            writeFile('tmp.csv', result.stdout);
        }
        const grades = {};
        return yield new Promise(function (resolve, reject) {
            fs.createReadStream('tmp.csv')
                .pipe(csv())
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
                writeFile('seating-plan.json', JSON.stringify(documentTemplate, null, '  '));
                resolve(documentTemplate);
            });
        });
    });
}
