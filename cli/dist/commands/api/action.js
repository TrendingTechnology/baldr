import { start, restart } from '@bldr/rest-api';
export default async function action(port, opts) {
    if (opts?.restart != null && opts?.restart) {
        restart();
    }
    else {
        await start(port);
    }
}
