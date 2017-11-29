How to write a bladr master slide: [Interface](module-baldr-master_INTERFACE.html)

# Objects

Code to pretty print objects:

```js
// TODO: remove
let pretty = function(object) {
  let pretty = require('js-object-pretty-print').pretty;
  console.log(pretty(object));
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

## `stepData`

```
{
    1: <misc>,
    2: <misc>,
    ...
}
```
