/**
 * Build the main menu for the Electron app and build a menu for the
 * web app.
 *
 * @module @bldr/lamp/menu
 */

/**
 * @typedef RawMenuItem
 * @property {String} label - A short label of the menu entry.
 * @property {String} description - A longer description of the menu entry.
 * @property {String} action - For example “pushRoute”, “openExternalUrl”,
 *    “executeCallback”.
 * @property arguments - Arguments for the action, for example a callback name
 *   or a route name or a URL.
 * @property {Array} submenu - A array of menu entries to build a sub menu from.
 * @property {String} keyboardShortcut - Keyboard shortcuts to pass through mousetrap
 *   and to pass through the Electron Accelerator.
 * @property {Array} activeOnRoutes
 */

/**
 * @param {String} keys - A raw keyboard shortcut specification.
 * @param {String} forClient - For which client the shortcuts have to
 *   normalized. Possible values are “mousetrap” or “electron” (Accelerator.)
 */
export function normalizeKeyboardShortcuts (keys, forClient = 'mousetrap') {
  if (forClient === 'mousetrap') {
    // See https://craig.is/killing/mice
    keys = keys.replace('Ctrl', 'ctrl')
    keys = keys.replace('Shift', 'shift')
    keys = keys.replace('Alt', 'alt')
    keys = keys.replace('Left', 'left')
    keys = keys.replace('Right', 'right')
    keys = keys.replace('Up', 'up')
    keys = keys.replace('Down', 'down')
    keys = keys.replace('Space', 'space')
  } else if (forClient === 'electron') {
    // https://www.electronjs.org/docs/api/accelerator
    keys = keys.replace('Ctrl', 'CommandOrControl')
  } else {
    throw new Error(`The argument “forClient” has to be “mousetrap” or “electron” not “${forClient}”`)
  }
  return keys.replace(/\s+\+\s+/g, '+')
}

/**
 * @param {Array.<RawMenuItem>} input - An array of raw menu items.
 * @param {Array} output - An array with processed menu items.
 * @param {Function} func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns {Array} A recursive array of processed menu items.
 */
function traverseMenuItemList (input, output, func) {
  for (const rawMenuItem of input) {
    let result
    if (rawMenuItem.submenu) {
      result = {
        label: rawMenuItem.label,
        submenu: traverseMenuItemList(rawMenuItem.submenu, [], func)
      }
    } else {
      result = func(rawMenuItem)
    }
    output.push(result)
  }
  return output
}

/**
 * @param {Array} input - An array of raw menu items.
 * @param {Function} func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns {Array} A recursive array of processed menu items.
 */
export function traverseMenu (input, func) {
  const newMenu = []
  traverseMenuItemList(input, newMenu, func)
  return newMenu
}

const menuTemplate = [
  {
    label: 'Navigation',
    submenu: [
      {
        label: 'Themen',
        action: 'pushRouter',
        arguments: 'topics',
        keyboardShortcut: 't'
      },
      {
        label: 'Master Dokumentation',
        action: 'pushRouter',
        arguments: 'documentation',
        keyboardShortcut: 'd'
      },
      {
        label: 'Ad-Hoc-Folien',
        submenu: [
          {
            label: 'Hefteintrag',
            action: 'pushRouter',
            arguments: 'editor',
            keyboardShortcut: 'e'
          },
          {
            label: 'Dokumentenkamera',
            action: 'pushRouter',
            arguments: 'camera',
            keyboardShortcut: 'c'
          }
        ]
      },
      {
        label: 'Folien',
        submenu: [
          {
            label: 'zur vorhergehenden Folie',
            action: 'executeCallback',
            arguments: 'goToPreviousSlide',
            keyboardShortcut: 'Ctrl + Left',
            activeOnRoutes: ['slide', 'slide-step-no', 'speaker-view', 'speaker-view-step-no']
          },
          {
            label: 'zur nächsten Folie',
            action: 'executeCallback',
            arguments: 'goToNextSlide',
            keyboardShortcut: 'Ctrl + Right',
            activeOnRoutes: ['slide', 'slide-step-no', 'speaker-view', 'speaker-view-step-no']
          },
          {
            label: 'zum vorhergehenden Schritt',
            action: 'executeCallback',
            arguments: 'goToPreviousStep',
            keyboardShortcut: 'Ctrl + Up',
            activeOnRoutes: ['slide-step-no', 'speaker-view-step-no']
          },
          {
            label: 'zum nächsten Schritt',
            action: 'executeCallback',
            arguments: 'goToNextStep',
            keyboardShortcut: 'Ctrl + Down',
            activeOnRoutes: ['slide-step-no', 'speaker-view-step-no']
          },
          {
            label: 'zur/m vorhergehenden Folie oder Schritt',
            action: 'executeCallback',
            arguments: 'goToPreviousSlideOrStep',
            keyboardShortcut: 'Left',
            activeOnRoutes: ['slide', 'slide-step-no', 'speaker-view', 'speaker-view-step-no']
          },
          {
            label: 'zur/m nächsten Folie oder Schritt',
            action: 'executeCallback',
            arguments: 'goToNextSlideOrStep',
            keyboardShortcut: 'Right',
            activeOnRoutes: ['slide', 'slide-step-no', 'speaker-view', 'speaker-view-step-no']
          }
        ]
      },
      {
        label: 'API Dokumentation',
        action: 'openExternalUrl',
        arguments: 'https://josef-friedrich.github.io/baldr/'
      },
      {
        label: 'Medien-Überblick',
        action: 'executeCallback',
        arguments: 'toggleMediaOverview',
        keyboardShortcut: 'm'
      },
      {
        label: 'Startseite',
        action: 'executeCallback',
        arguments: 'toggleHome',
        keyboardShortcut: 'h'
      },
      {
        label: 'Folien-Vorschau',
        action: 'executeCallback',
        arguments: 'toggleSlidesPreview',
        keyboardShortcut: 's'
      },
      {
        label: 'REST-API',
        action: 'executeCallback',
        arguments: 'toggleRestApi',
        keyboardShortcut: 'Ctrl + Alt + r'
      }
    ]
  },
  {
    label: 'Aktionen',
    submenu: [
      {
        label: 'Aktualsieren',
        description: 'Lokalen Medienserver aktualisieren.',
        action: 'executeCallback',
        arguments: 'update',
        keyboardShortcut: 'Ctrl + u'
      },
      {
        label: 'Neu laden',
        description: 'Präsentation neu laden.',
        action: 'executeCallback',
        arguments: 'reloadPresentation',
        keyboardShortcut: 'Ctrl + r'
      },
      {
        label: 'Öffnen ...',
        submenu: [
          {
            label: 'Präsentation (Editor)',
            desciption: 'Die aktuelle Präsentation im Editor öffnen',
            action: 'executeCallback',
            arguments: 'openEditor',
            keyboardShortcut: 'Ctrl + e'
          },
          {
            label: 'Mediendatei (Editor)',
            desciption: 'Die erste Mediendatei der aktuellen Folien im Editor öffnen.',
            action: 'executeCallback',
            arguments: 'openMedia',
            keyboardShortcut: 'Ctrl + a'
          },
          {
            label: 'Übergeordneter Ordner',
            desciption: 'Den übergeordneten Ordner der Präsentation öffnen',
            action: 'executeCallback',
            arguments: 'openParent',
            keyboardShortcut: 'Ctrl + Alt + e'
          },
          {
            label: 'Übergeordneter Ordner und Archivorder',
            desciption: 'Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner öffnen',
            action: 'executeCallback',
            arguments: 'openParentArchive',
            keyboardShortcut: 'Ctrl + Shift + Alt + e'
          },
          {
            label: 'Präsentation (Editor), übergeordneter Ordner und Archivorder',
            desciption: 'Vollständiger Editiermodus: Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner, als auch den Editor öffnen',
            action: 'executeCallback',
            arguments: 'openEditorParentArchive',
            keyboardShortcut: 'Ctrl + Alt + r'
          }
        ]
      }
    ]
  },
  {
    label: 'Ansicht',
    submenu: [
      { role: 'togglefullscreen' },
      {
        label: 'Schriftgröße zurücksetzen',
        description: 'Die aktuelle Folie auf den Skalierungsfaktor 1 (zurück)setzen.',
        action: 'executeCallback',
        arguments: 'resetSlideScaleFactor',
        keyboardShortcut: 'Ctrl + 1'
      },
      {
        label: 'Schriftgröße vergrößern',
        description: 'Die aktuelle Folie vergrößern.',
        action: 'executeCallback',
        arguments: 'increaseSlideScaleFactor',
        keyboardShortcut: 'Ctrl + 2'
      },
      {
        label: 'Schriftgröße verkleinern',
        description: 'Die aktuelle Folie verkleinern.',
        action: 'executeCallback',
        arguments: 'decreaseSlideScaleFactor',
        keyboardShortcut: 'Ctrl + 3'
      },
      {
        label: 'Zwischen zwei Folien hin- und herschalten.',
        action: 'executeCallback',
        arguments: 'toggleSlides',
        keyboardShortcut: 'Ctrl + y'
      },
      {
        label: 'Metainformation',
        description: 'Metainformation der Folien ein/ausblenden',
        action: 'executeCallback',
        arguments: 'toggleMetaDataOverlay',
        keyboardShortcut: 'Ctrl + i'
      },
      {
        label: 'Referentenansicht',
        description: 'Zwischen Präsentations- und Referentenansicht hin- und herschalten.',
        action: 'executeCallback',
        arguments: 'toggleSpeakerView',
        keyboardShortcut: 'Ctrl + l'
      },
      {
        label: 'Dark mode',
        action: 'executeCallback',
        arguments: 'toggleDarkMode',
        keyboardShortcut: 'Ctrl + Alt + d'
      },
      {
        label: 'Standard-Darstellung',
        action: 'executeCallback',
        arguments: 'resetStyles',
        keyboardShortcut: 'Ctrl + Alt + s'
      },
      {
        label: 'Vollbild',
        action: 'executeCallback',
        arguments: 'enterFullscreen',
        keyboardShortcut: 'Ctrl + f'
      }
    ]
  }
]

export default menuTemplate
