# Objects

------------------------------------------------------------------------

## ``

```

```

------------------------------------------------------------------------

## `config`

```
{
    sessionFile: "test/files/all.baldr",
    sessionDir: "/home/baldr/test/files",
    raw: {
        slides: []
    },
    slides: circular reference
}
```

------------------------------------------------------------------------

## `masters`

```json

{
  "path": "/home/baldr/masters",
  "all": [
    "audio",
    "camera",
    "editor",
    "image",
    "markdown",
    "person",
    "question",
    "quote",
    "svg",
    "website"
  ],
  "audio": {
    "config": {
      "centerVertically": false,
      "stepSupport": false,
      "theme": "default"
    },
    "path": "/home/baldr/masters/audio",
    "css": false
  },
  "..."
}

```

------------------------------------------------------------------------

## `master`

```
{
    init: "function (document)",
    normalizeData: "function (data, config)",
    modalHTML: "function ()",
    mainHTML: "function (data)",
    postSet: "function ()",
    setStepByNo: "function ()",
    initSteps: "function ()",
    initStepsEveryVisit: "function ()",
    config: {
        centerVertically: false,
        stepSupport: false,
        theme: "default"
    },
    name: "audio",
    path: "/home/baldr/masters/audio",
    css: false
}
```

------------------------------------------------------------------------

## `slide`

```
{
    no: 1,
    master: "audio",
    data: [
        "media/audio/mozart.mp3",
        "media/audio/haydn.mp3",
        "media/audio/beethoven.mp3"
    ]
}
```
