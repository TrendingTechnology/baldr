import { start, restart } from '@bldr/rest-api'

interface Options {
  restart?: boolean
}

export default async function action (port: number, opts?: Options): Promise<void> {
  if (opts?.restart != null && opts?.restart) {
    restart()
  } else {
    await start(port)
  }
}
