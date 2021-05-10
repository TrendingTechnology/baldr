const assert = require('assert')

const { traverseMenu } = require('../dist/node/main.js')

const menuTemplate = [
  {
    label: 'Datei',
    submenu: [
      {
        label: 'Öffnen ...',
        submenu: [
          {
            label: 'Präsentation (Editor)',
            description: 'Die aktuelle Präsentation im Editor öffnen',
            action: 'executeCallback',
            arguments: 'openEditor',
            keyboardShortcut: 'Ctrl + e'
          }
        ]
      },
      { role: 'quit' }
    ]
  },
  {
    label: 'Navigation',
    submenu: [
      {
        label: 'Startseite',
        action: 'executeCallback',
        arguments: 'toggleHome',
        keyboardShortcut: 'h'
      },
      {
        label: 'Ad-Hoc-Folien',
        submenu: [
          {
            label: 'Hefteintrag',
            action: 'executeCallback',
            arguments: 'toggleEditor',
            keyboardShortcut: 'e'
          }
        ]
      }
    ]
  },
  {
    label: 'Hilfe',
    submenu: [
      {
        label: 'Über diese App',
        action: 'pushRouter',
        arguments: 'about'
      },
      {
        label: 'Master Dokumentation',
        action: 'pushRouter',
        arguments: 'documentation',
        keyboardShortcut: 'd'
      },
      {
        label: 'API Dokumentation',
        action: 'openExternalUrl',
        arguments: 'https://josef-friedrich.github.io/baldr/'
      }
    ]
  }
]
