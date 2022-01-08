// Node packages
import path from 'path';
// Project packages.
import { CommandRunner } from '@bldr/cli-utils';
import { getConfig } from '@bldr/config';
const config = getConfig();
/**
 * Open the Inkscape template.
 */
export default async function action() {
    const cmd = new CommandRunner({
        verbose: false
    });
    await cmd.exec([
        'inkscape',
        path.join(config.mediaServer.basePath, 'faecheruebergreifend', 'Inkscape-Vorlagen', 'Inkscape-Vorlage.svg')
    ], { detached: true });
}
