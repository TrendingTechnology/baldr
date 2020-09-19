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
 * @property {String} action - For example “pushRoute”, “openExternalUrl”, “execute”
 * @property arguments - Arguments for the action function.
 * @property {Array} submenu - A array of menu entries to build a sub menu from.
 * @property {String} accelerator - Keyboard shortcuts to pass through mousetrap
 *   and to pass through the Electron Accelerator.
 * @property {Array} activeOnRoutes
 */

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
        accelerator: 't'
      },
      {
        label: 'Master Dokumentation',
        action: 'pushRouter',
        arguments: 'documentation',
        accelerator: 'd'
      },
      {
        label: 'Ad-Hoc-Folien',
        submenu: [
          {
            label: 'Hefteintrag',
            action: 'pushRouter',
            arguments: 'editor',
            accelerator: 'e'
          },
          {
            label: 'Dokumentenkamera',
            action: 'pushRouter',
            arguments: 'camera',
            accelerator: 'c'
          }
        ]
      },
      {
        label: 'Folien',
        submenu: [
          {
            label: 'zur vorhergehenden Folie',
            action: 'execute',
            arguments: 'goToPreviousSlide',
            accelerator: 'Ctrl + Left',
            activeOnRoutes: ['slide', 'slide-step-no', 'speaker-view', 'speaker-view-step-no']
          },
          {
            label: 'zur nächsten Folie',
            action: 'execute',
            arguments: 'goToNextSlide',
            accelerator: 'Ctrl + Right',
            activeOnRoutes: ['slide', 'slide-step-no', 'speaker-view', 'speaker-view-step-no']
          },
          {
            label: 'zum vorhergehenden Schritt',
            action: 'execute',
            arguments: 'goToPreviousStep',
            accelerator: 'Ctrl + Up',
            activeOnRoutes: ['slide-step-no', 'speaker-view-step-no']
          },
          {
            label: 'zum nächsten Schritt',
            action: 'execute',
            arguments: 'goToNextStep',
            accelerator: 'Ctrl + Down',
            activeOnRoutes: ['slide-step-no', 'speaker-view-step-no']
          },
          {
            label: 'zur/m vorhergehenden Folie oder Schritt',
            action: 'execute',
            arguments: 'goToPreviousSlideOrStep',
            accelerator: 'Left',
            activeOnRoutes: ['slide', 'slide-step-no', 'speaker-view', 'speaker-view-step-no']
          },
          {
            label: 'zur/m nächsten Folie oder Schritt',
            action: 'execute',
            arguments: 'goToNextSlideOrStep',
            accelerator: 'Right',
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
        action: 'execute',
        arguments: 'toggleMediaOverview',
        accelerator: 'm'
      },
      {
        label: 'Startseite',
        action: 'execute',
        arguments: 'toggleHome',
        accelerator: 'h'
      },
      {
        label: 'Folien-Vorschau',
        action: 'execute',
        arguments: 'toggleSlidesPreview',
        accelerator: 's'
      },
      {
        label: 'REST-API',
        action: 'execute',
        arguments: 'toggleRestApi',
        accelerator: 'Ctrl + Alt + r'
      }
    ]
  },
  {
    label: 'Aktionen',
    submenu: [
      {
        label: 'Aktualsieren',
        description: 'Lokalen Medienserver aktualisieren.',
        action: 'execute',
        arguments: 'update',
        accelerator: 'Ctrl + u'
      },
      {
        label: 'Neu laden',
        description: 'Präsentation neu laden.',
        action: 'execute',
        arguments: 'reloadPresentation',
        accelerator: 'Ctrl + r'
      },
      {
        label: 'Öffnen ...',
        submenu: [
          {
            label: 'Präsentation (Editor)',
            desciption: 'Die aktuelle Präsentation im Editor öffnen',
            action: 'execute',
            arguments: 'openEditor',
            accelerator: 'Ctrl + e'
          },
          {
            label: 'Mediendatei (Editor)',
            desciption: 'Die erste Mediendatei der aktuellen Folien im Editor öffnen.',
            action: 'execute',
            arguments: 'openMedia',
            accelerator: 'Ctrl + a'
          },
          {
            label: 'Übergeordneter Ordner',
            desciption: 'Den übergeordneten Ordner der Präsentation öffnen',
            action: 'execute',
            arguments: 'openParent',
            accelerator: 'Ctrl + Alt + e'
          },
          {
            label: 'Übergeordneter Ordner und Archivorder',
            desciption: 'Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner öffnen',
            action: 'execute',
            arguments: 'openParentArchive',
            accelerator: 'Ctrl + Shift + Alt + e'
          },
          {
            label: 'Präsentation (Editor), übergeordneter Ordner und Archivorder',
            desciption: 'Vollständiger Editiermodus: Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner, als auch den Editor öffnen',
            action: 'execute',
            arguments: 'openEditorParentArchive',
            accelerator: 'Ctrl + Alt + r'
          }
        ]
      }
    ]
  },
  {
    label: 'Ansicht',
    submenu: [
      {
        label: 'Schriftgröße zurücksetzen',
        description: 'Die aktuelle Folie auf den Skalierungsfaktor 1 (zurück)setzen.',
        action: 'execute',
        arguments: 'resetSlideScaleFactor',
        accelerator: 'Ctrl + 1'
      },
      {
        label: 'Schriftgröße vergrößern',
        description: 'Die aktuelle Folie vergrößern.',
        action: 'execute',
        arguments: 'increaseSlideScaleFactor',
        accelerator: 'Ctrl + 2'
      },
      {
        label: 'Schriftgröße verkleinern',
        description: 'Die aktuelle Folie verkleinern.',
        action: 'execute',
        arguments: 'decreaseSlideScaleFactor',
        accelerator: 'Ctrl + 3'
      },
      {
        label: 'Zwischen zwei Folien hin- und herschalten.',
        action: 'execute',
        arguments: 'toggleSlides',
        accelerator: 'Ctrl + y'
      },
      {
        label: 'Metainformation',
        description: 'Metainformation der Folien ein/ausblenden',
        action: 'execute',
        arguments: 'toggleMetaDataOverlay',
        accelerator: 'Ctrl + i'
      },
      {
        label: 'Referentenansicht',
        description: 'Zwischen Präsentations- und Referentenansicht hin- und herschalten.',
        action: 'execute',
        arguments: 'toggleSpeakerView',
        accelerator: 'Ctrl + l'
      }
    ]
  }
]

export default menuTemplate
