[![npm](https://img.shields.io/npm/v/baldr-sbook.svg)](https://www.npmjs.com/package/baldr-sbook)

# baldr-sbook - BALDUR Songbook

A fullscreen electron app to display songs in a class room using a
projector.

## Installation

```
npm install
npm run-script build
npm run-script start
```

## Songs tree

### clean

Each song has to be in his own folder. This individual song folders must
be in this parent folders:

```
0abcdefghijklmnopqrstuvwxyz
```

Folders names begining with “.” or “_” are ignored.

```
.
├── a
│   └── Auf-der-Mauer_auf-der-Lauer
│       ├── info.json
│       ├── piano.mscx
│       └── projector.mscx
├── s
│   ├── .hidden
│   │   └── README.md
│   ├── _scripts
│   │   └── README.md
│   ├── Stille-Nacht
│   │   ├── info.json
│   │   ├── lead.mscx
│   │   └── projector.mscx
│   └── Swing-low
│       ├── info.json
│       ├── lead.mscx
│       └── projector.mscx
└── z
    └── Zum-Tanze-da-geht-ein-Maedel
        ├── info.json
        ├── lead.mscx
        └── projector.mscx
```

### processed

To process the MuseScore to the necessary image formats use the command
line utility
[baldr-sbook-updtr](https://github.com/JosefFriedrich-nodejs/baldr-sbook-updtr).

```
.
├── a
│   └── Auf-der-Mauer_auf-der-Lauer
│       ├── info.json
│       ├── piano
│       │   ├── piano_1.eps
│       │   ├── piano_2.eps
│       │   ├── piano_3.eps
│       │   └── piano.mscx
│       ├── piano.mscx
│       ├── projector.mscx
│       ├── projector.pdf
│       └── slides
│           ├── 01.svg
│           ├── 02.svg
│           ├── 03.svg
│           └── 04.svg
├── s
│   ├── Stille-Nacht
│   │   ├── info.json
│   │   ├── lead.mscx
│   │   ├── piano
│   │   │   ├── piano.eps
│   │   │   └── piano.mscx
│   │   ├── projector.mscx
│   │   ├── projector.pdf
│   │   └── slides
│   │       └── 01.svg
│   └── Swing-low
│       ├── info.json
│       ├── lead.mscx
│       ├── piano
│       │   ├── piano_1.eps
│       │   ├── piano_2.eps
│       │   ├── piano_3.eps
│       │   └── piano.mscx
│       ├── projector.mscx
│       ├── projector.pdf
│       └── slides
│           ├── 01.svg
│           ├── 02.svg
│           └── 03.svg
└── z
    └── Zum-Tanze-da-geht-ein-Maedel
        ├── info.json
        ├── lead.mscx
        ├── piano
        │   ├── piano_1.eps
        │   ├── piano_2.eps
        │   └── piano.mscx
        ├── projector.mscx
        ├── projector.pdf
        └── slides
            ├── 01.svg
            └── 02.svg

```

A tool to mirror displays on Mac OS is
[mirror-display](https://github.com/fcanas/mirror-displays).
The binary `mirror` is included in this repository.
