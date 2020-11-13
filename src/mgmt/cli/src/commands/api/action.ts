import { runRestApi } from '@bldr/media-server'

function action (port: number) {
  runRestApi(port)
}

export = action
