import { start, restart } from '@bldr/media-server'

interface Options {
  restart?: boolean
}

async function action (port: number, opts?: Options): Promise<void> {
  if (opts?.restart != null && opts?.restart) {
    restart()
  } else {
    await start(port)
  }
}

export = action
