# Objects

Code to pretty print objects:

```js
// TODO: remove
let pretty = function(object) {
  let pretty = require('js-object-pretty-print').pretty;
  console.log(pretty(object));
}
```

Use HTML like notation `<object>` to reference objects.

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

## `document`

```
{
    location: {
        replace: "function ()",
        assign: "function ()",
        href: "file:///home//baldr/render.html",
        ancestorOrigins: {

        },
        origin: "file://",
        protocol: "file:",
        host: "",
        hostname: "",
        port: "",
        pathname: "/home/jf/baldr/render.html",
        search: "",
        hash: "",
        reload: "function reload()"
    }
}
```

------------------------------------------------------------------------

## `masters`

```

{
    path: "/home/jf/git-repositories/github/JosefFriedrich-nodejs/baldr/masters",
    all: [
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
    masterName: <master>
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
    rawData: <misc>
    normalizedData: <misc>
    steps: 
}
```

------------------------------------------------------------------------

## `stepData`

```
{
    1: <misc>,
    2: <misc>,
    ...
}
```

------------------------------------------------------------------------

## `themes`

```
{
    document: <document>
    path: "/home//baldr/themes",
    all: [
        "default",
        "handwriting"
    ]
}
```
