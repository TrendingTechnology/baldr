import childProcess from 'child_process'
import { msleep } from '@bldr/core-browser'

export default function (): void {
  const p = childProcess.spawnSync('systemctl', [
    '--user',
    'restart',
    'baldr_api.service'
  ])
  if (p.status !== 0) {
    throw new Error(
      'The restart of the systemd service “baldr_api.service” failed!'
    )
  }
  msleep(1500)
}
