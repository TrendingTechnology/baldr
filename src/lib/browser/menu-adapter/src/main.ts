/**
 * Provide a unifed interface for both the Electron and the @bldr/menu menu
 * components.
 *
 * src/vue/apps/lamp/src/MainApp.vue
 *
 * ```js
 * const registerMenuItem = (raw) => {
 *   let action
 *   if (!raw.keyboardShortcut) return
 *   if (raw.action === 'executeCallback') {
 *     action = actions[raw.arguments]
 *   } else if (raw.action === 'pushRouter') {
 *     action = () => {
 *       this.$router.push({ name: raw.arguments })
 *     }
 *   } else if (raw.action === 'openExternalUrl') {
 *     action = () => {
 *       window.open(raw.arguments, '_blank')
 *     }
 *   } else if (raw.action === 'clearCache') {
 *     // Only in the electron app. Clear HTTP Cache.
 *     return
 *   } else {
 *     throw new Error(`Unkown action for raw menu entry: ${raw.label}`)
 *   }
 *   this.$shortcuts.add(normalizeKeyboardShortcuts(raw.keyboardShortcut), action, raw.label, raw.activeOnRoutes)
 * }
 * ```
 *
 * src/vue/apps/lamp/src/components/DropDownMenu.vue
 *
 * ```js
 * function convertMenuItem (raw) {
 *   const result = {}
 *   if (raw.role) return
 *   // label
 *   if (!raw.label) throw new Error(`Raw menu entry needs a key named label: ${raw}`)
 *   result.label = raw.label
 *   // click
 *   if (!raw.action) throw new Error(`Raw menu entry needs a key named action: ${raw}`)
 *   let click
 *   if (raw.action === 'openExternalUrl') {
 *
 *   } else if (raw.action === 'pushRouter') {
 *     click = () => {
 *       router.push({ name: raw.arguments })
 *     }
 *   } else if (raw.action === 'clearCache') {
 *     // Only in the electron app. Clear HTTP Cache.
 *     return
 *   } else if (raw.action === 'executeCallback') {
 *     click = actions[raw.arguments]
 *   } else {
 *     throw new Error(`Unkown action for raw menu entry: ${raw}`)
 *   }
 *   result.click = click
 *   if (raw.keyboardShortcut) result.keyboardShortcut = raw.keyboardShortcut
 *   return result
 * }
 * ```
 *
 * @module @bldr/menu-adapter
 */

interface RawMenuItem {
  /**
   * A short label of the menu entry.
   */
  label?: string

  /**
   * A longer description of the menu entry.
   */
  description?: string

  action?: 'pushRouter' | 'openExternalUrl' | 'executeCallback' | 'clearCache'

  /**
   * Arguments for the action, for example a callback name or a route name or a URL.
   */
  arguments?: any

  /**
   * A array of menu entries to build a sub menu from.
   */
  submenu?: RawMenuItem[]

  /**
   * Keyboard shortcuts to pass through mousetrap
   *   and to pass through the Electron Accelerator.
   */
  keyboardShortcut?: string

  activeOnRoutes?: string[]

  role?: any
}

/**
 * @param keys - A raw keyboard shortcut specification.
 * @param forClient - For which client the shortcuts have to
 *   normalized. Possible values are “mousetrap” or “electron” (Accelerator.)
 */
export function normalizeKeyboardShortcuts (keys: string, forClient: 'mousetrap' | 'electron' = 'mousetrap'): string {
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
  }
  return keys.replace(/\s+\+\s+/g, '+')
}

/**
 * @param input - An array of raw menu items.
 * @param output - An array with processed menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
function traverseMenuItemList (input: RawMenuItem[], output: any[], func: (input: RawMenuItem) => any): any[] {
  for (const rawMenuItem of input) {
    let result
    if (rawMenuItem.submenu != null) {
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
 * @param input - An array of raw menu items.
 * @param func - A function which is called with the argument
 *   `rawMenuItem`.
 *
 * @returns A recursive array of processed menu items.
 */
export function traverseMenu (input: RawMenuItem[], func: (input: RawMenuItem) => any): any[] {
  const newMenu: any[] = []
  traverseMenuItemList(input, newMenu, func)
  return newMenu
}

const menuTemplate: RawMenuItem[] = [
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
          },
          {
            label: 'Mediendatei (Editor)',
            description: 'Die erste Mediendatei der aktuellen Folien im Editor öffnen.',
            action: 'executeCallback',
            arguments: 'openMedia',
            keyboardShortcut: 'Ctrl + a'
          },
          {
            label: 'Übergeordneter Ordner',
            description: 'Den übergeordneten Ordner der Präsentation öffnen',
            action: 'executeCallback',
            arguments: 'openParent',
            keyboardShortcut: 'Ctrl + Alt + e'
          },
          {
            label: 'Übergeordneter Ordner und Archivorder',
            description: 'Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner öffnen',
            action: 'executeCallback',
            arguments: 'openParentArchive',
            keyboardShortcut: 'Ctrl + Shift + Alt + e'
          },
          {
            label: 'Präsentation (Editor), übergeordneter Ordner und Archivorder',
            description: 'Vollständiger Editiermodus: Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner, als auch den Editor öffnen',
            action: 'executeCallback',
            arguments: 'openEditorParentArchive',
            keyboardShortcut: 'Ctrl + Alt + r'
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
        label: 'Folien-Vorschau',
        action: 'executeCallback',
        arguments: 'toggleSlidesPreview',
        keyboardShortcut: 's'
      },
      {
        label: 'Medien-Überblick',
        action: 'executeCallback',
        arguments: 'toggleMediaOverview',
        keyboardShortcut: 'm'
      },
      {
        label: 'Metadaten-Kategorien',
        action: 'pushRouter',
        arguments: 'media-categories',
        keyboardShortcut: 'n'
      },
      {
        label: 'Themen',
        action: 'pushRouter',
        arguments: 'topics',
        keyboardShortcut: 't'
      },
      {
        label: 'Ad-Hoc-Folien',
        submenu: [
          {
            label: 'Hefteintrag',
            action: 'executeCallback',
            arguments: 'toggleEditor',
            keyboardShortcut: 'e'
          },
          {
            label: 'Dokumentenkamera',
            action: 'executeCallback',
            arguments: 'toggleCamera',
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
        label: 'Medien ...',
        submenu: [
          {
            label: 'Spiele/Pausiere',
            action: 'executeCallback',
            arguments: 'togglePlayer',
            keyboardShortcut: 'space'
          },
          {
            label: 'Stop',
            action: 'executeCallback',
            arguments: 'stopPlayer',
            keyboardShortcut: 'p s'
          },
          {
            label: 'ausblenden',
            description: 'Audio/Video-Ausschnitt langsam ausblenden',
            action: 'executeCallback',
            arguments: 'fadeOutPlayer',
            keyboardShortcut: 'p f'
          },
          {
            label: 'Start',
            description: 'Starte geladenen Audio/Video-Ausschnitt',
            action: 'executeCallback',
            arguments: 'startPlayer',
            keyboardShortcut: 'ctrl+space'
          },
          {
            label: 'Vorhergehender Ausschnitt',
            description: 'Spiele den vorhergehenden Ausschnitt.',
            action: 'executeCallback',
            arguments: 'startPreviousInPlaylist',
            keyboardShortcut: 'ctrl+left'
          },
          {
            label: 'Nächster Ausschnitt',
            description: 'Spiele den nächsten Ausschnitt.',
            action: 'executeCallback',
            arguments: 'startNextInPlaylist',
            keyboardShortcut: 'ctrl+right'
          },
          {
            label: 'vorspulen',
            description: 'Um 10s nach vorne springen.',
            action: 'executeCallback',
            arguments: 'forwardPlayer',
            keyboardShortcut: 'ctrl+shift+right'
          },
          {
            label: 'zurückspulen',
            description: 'Um 10s nach hinten springen.',
            action: 'executeCallback',
            arguments: 'backwardPlayer',
            keyboardShortcut: 'ctrl+shift+left'
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
      // { role: 'togglefullscreen' },
      {
        label: 'Vollbild',
        action: 'executeCallback',
        arguments: 'enterFullscreen',
        keyboardShortcut: 'Ctrl + f'
      }
    ]
  },
  {
    label: 'Entwicklung',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      {
        label: 'Cache löschen',
        action: 'clearCache',
        keyboardShortcut: 'Ctrl + Alt + c'
      },
      {
        label: 'REST-API',
        action: 'executeCallback',
        arguments: 'toggleRestApi',
        keyboardShortcut: 'Ctrl + Alt + r'
      },
      {
        label: 'TeX-Markdown-Konvertierung',
        action: 'pushRouter',
        arguments: 'tex-markdown-converter'
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

export default menuTemplate
