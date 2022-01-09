import path from 'path';
import sassExport from 'sass-export';
import { getConfig } from '@bldr/config';
const config = getConfig();
const sassVariablesPath = path.join(config.localRepo, 'vue', 'plugins', 'themes', 'src', 'default-vars.scss');
export default function exportSass() {
    const struct = sassExport
        .exporter({
        inputFiles: [sassVariablesPath]
    })
        .getStructured();
    const vars = {};
    for (const v of struct.variables) {
        if (v.name !== '$colors') {
            vars[v.name] = v.compiledValue;
        }
    }
    return vars;
}
