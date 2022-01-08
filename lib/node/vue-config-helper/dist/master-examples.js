import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
export function readMasterExamples() {
    function getBaseName(filePath) {
        return filePath.replace('.baldr.yml', '');
    }
    const examples = {
        common: {},
        masters: {}
    };
    const basePath = path.join(require
        .resolve('@bldr/presentation-parser')
        .replace('/dist/main.js', ''), 'tests', 'files');
    // common
    const commonBasePath = path.join(basePath, 'common');
    for (const exampleFile of fs.readdirSync(commonBasePath)) {
        if (exampleFile.match(/\.baldr\.yml$/) != null) {
            const rawYaml = fs.readFileSync(path.join(commonBasePath, exampleFile), 'utf8');
            examples.common[getBaseName(exampleFile)] = rawYaml;
        }
    }
    // masters
    const mastersBasePath = path.join(basePath, 'masters');
    for (const masterName of fs.readdirSync(mastersBasePath)) {
        const rawYaml = fs.readFileSync(path.join(mastersBasePath, masterName), 'utf8');
        examples.masters[getBaseName(masterName)] = rawYaml;
    }
    return examples;
}
