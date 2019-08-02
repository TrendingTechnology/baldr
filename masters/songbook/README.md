# @bldr/songbook

## Testing

```
mocha
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
line utility `baldr-songbook-updater`.

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
