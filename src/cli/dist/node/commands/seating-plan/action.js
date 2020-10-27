var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Node packages.
const fs = require('fs');
// Third party packages.
const csv = require('csv-parser');
// Project packages.
const { CommandRunner } = require('@bldr/cli-utils');
const { writeFile } = require('@bldr/media-manager');
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
    meta: {
        location: 'Pirckheimer-Gymnasium, Nürnberg',
        teacher: 'OStR Josef Friedrich',
        year: '2019/20'
    }
};
/**
 * @param {String} mdbFile
 */
function action(mdbFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new CommandRunner();
        const result = yield cmd.exec(['mdb-export', mdbFile, 'Schüler']);
        writeFile('tmp.csv', result.stdout);
        const grades = {};
        fs.createReadStream('tmp.csv')
            .pipe(csv())
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
            writeFile('seating-plan.json', JSON.stringify(documentTemplate, null, '  '));
        });
    });
}
module.exports = action;
