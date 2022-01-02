import childProcess from 'child_process'
import { msleep } from '@bldr/core-browser'

/**
 * Restart the systemd service baldr_api.service and sleep some time
 * afterwards.
 *
 * @param ms - How many milliseconds to wait after execution.
 */
export default function (ms: number = 0): void {
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
  msleep(ms)
}
