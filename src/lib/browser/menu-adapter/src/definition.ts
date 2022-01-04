import { RawMenuItem } from './menu-item'

export const universalMenuDefinition: RawMenuItem[] = [
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
            description:
              'Die erste Mediendatei der aktuellen Folien im Editor öffnen.',
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
            description:
              'Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner öffnen',
            action: 'executeCallback',
            arguments: 'openParentArchive',
            keyboardShortcut: 'Ctrl + Shift + Alt + e'
          },
          {
            label:
              'Präsentation (Editor), übergeordneter Ordner und Archivorder',
            description:
              'Vollständiger Editiermodus: Den übergeordneten Ordner der Präsentation, sowie den dazugehörenden Archivordner, als auch den Editor öffnen',
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
        arguments: 'titles',
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
            activeOnRoutes: [
              'slide',
              'slide-step-no',
              'speaker-view',
              'speaker-view-step-no'
            ]
          },
          {
            label: 'zur nächsten Folie',
            action: 'executeCallback',
            arguments: 'goToNextSlide',
            keyboardShortcut: 'Ctrl + Right',
            activeOnRoutes: [
              'slide',
              'slide-step-no',
              'speaker-view',
              'speaker-view-step-no'
            ]
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
            activeOnRoutes: [
              'slide',
              'slide-step-no',
              'speaker-view',
              'speaker-view-step-no'
            ]
          },
          {
            label: 'zur/m nächsten Folie oder Schritt',
            action: 'executeCallback',
            arguments: 'goToNextSlideOrStep',
            keyboardShortcut: 'Right',
            activeOnRoutes: [
              'slide',
              'slide-step-no',
              'speaker-view',
              'speaker-view-step-no'
            ]
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
            keyboardShortcut: 'Space'
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
            keyboardShortcut: 'Ctrl + Space'
          },
          {
            label: 'starten / ausblenden',
            description: 'Starte geladenen Audio/Video-Ausschnitt von vorne / blende langsam aus',
            action: 'executeCallback',
            arguments: 'toggleStartFadeOutPlayer',
            keyboardShortcut: 'Return'
          },
          {
            label: 'Vorhergehender Ausschnitt',
            description: 'Spiele den vorhergehenden Ausschnitt.',
            action: 'executeCallback',
            arguments: 'startPreviousInPlaylist',
            keyboardShortcut: 'Ctrl + Alt + Left'
          },
          {
            label: 'Nächster Ausschnitt',
            description: 'Spiele den nächsten Ausschnitt.',
            action: 'executeCallback',
            arguments: 'startNextInPlaylist',
            keyboardShortcut: 'Ctrl + Alt + Right'
          },
          {
            label: 'vorspulen',
            description: 'Um 10s nach vorne springen.',
            action: 'executeCallback',
            arguments: 'forwardPlayer',
            keyboardShortcut: 'Ctrl + Shift + Right'
          },
          {
            label: 'zurückspulen',
            description: 'Um 10s nach hinten springen.',
            action: 'executeCallback',
            arguments: 'backwardPlayer',
            keyboardShortcut: 'Ctrl + Shift + Left'
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
        description:
          'Die aktuelle Folie auf den Skalierungsfaktor 1 (zurück)setzen.',
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
        description:
          'Zwischen Präsentations- und Referentenansicht hin- und herschalten.',
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
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      {
        label: 'Cache löschen',
        action: 'clearCache',
        keyboardShortcut: 'Ctrl + Alt + c'
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
