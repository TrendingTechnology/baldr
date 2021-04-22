import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'update [what]',
  alias: 'u',
  options: [
    ['-r, --only-remote', 'Only remote'],
    ['-l, --only-local', 'Only local']
  ],
  description: 'Update the remote and the local instances of BALDR. What: config, vue, api, media; without all',
  checkExecutable: [
    'curl',
    'git',
    'npx',
    'ssh',
    'systemctl',
    '/usr/local/bin/ansible-playbook-localhost.sh',
    'ansible-playbook'
  ]
})
