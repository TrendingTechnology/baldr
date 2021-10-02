import { runRestApi } from '@bldr/media-server'

function action (port: number): void {
  runRestApi(port)
}

export = action
