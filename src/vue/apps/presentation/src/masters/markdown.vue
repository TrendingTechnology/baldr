<template>
  <div class="markdown-master" v-html="markupCurrent">
  </div>
</template>

<script>
import marked from 'marked'

const example = `
---
slides:

- title: Using props
  markdown:
    markup: Using props

- title: Step support
  markdown:
    markup:
    - Step 1
    - Step 2

- title: Long text in stepts
  markdown:
    markup:
    - |
      Step 1: Tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea
      commodi consequat.

    - |
      Step 2: Quis aute iure reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
      cupiditat non proident, sunt in culpa qui officia deserunt mollit anim
      id est laborum.

- title: Top level step support
  markdown:
  - |
    Step 1: Tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea
    commodi consequat.

  - |
    Step 2: Quis aute iure reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
    cupiditat non proident, sunt in culpa qui officia deserunt mollit anim
    id est laborum.

- title: Long text
  markdown: |
    # Heading 1

    Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod
    tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea
    commodi consequat. Quis aute iure reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
    cupiditat non proident, sunt in culpa qui officia deserunt mollit anim
    id est laborum.

    # Heading 2

    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
    molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero
    eros et accumsan et iusto odio dignissim qui blandit praesent luptatum
    zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum
    dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
    euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

    # Heading 3

    Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
    suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem
    vel eum iriure dolor in hendrerit in vulputate velit esse molestie
    consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et
    accumsan et iusto odio dignissim qui blandit praesent luptatum zzril
    delenit augue duis dolore te feugait nulla facilisi.

    Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet
    doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit
    amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
    tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad
    minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis
    nisl ut aliquip ex ea commodo consequat.

    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
    molestie consequat, vel illum dolore eu feugiat nulla facilisis.

    At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
    ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
    voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
    clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At
    accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy
    sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd
    magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem
    ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
    elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
    aliquyam erat.

    Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
    accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no
    sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor
    sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
    vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
    gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
    ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
    voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
    clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet.

- title: Heading
  markdown: |
    # heading 1
    ## heading 2
    ### heading 3

- title: Lorem ipsum
  markdown: |
    Lorem ipsum dolor sit amet ...

    consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit
    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit
    anim id est laborum.

- title: Ordered list
  markdown: |
    1. one
    2. two
    3. three

- title: Unordered list
  markdown: |
    * one
    * two
    * three
`

function splitHtmlintoChunks (htmlString) {
  const threshold = 500
  if (htmlString.length < threshold) return [htmlString]

  const domParser = new DOMParser()
  const dom = domParser.parseFromString(htmlString, 'text/html')

  let buffer = ''
  const chunks = []

  for (const children of dom.body.children) {
    buffer += children.outerHTML
    if (buffer.length > threshold) {
      chunks.push(buffer)
      buffer = ''
    }
  }

  return chunks
}

export const master = {
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string' || Array.isArray(props)) {
      props = {
        markup: props
      }
    }
    if (typeof props.markup === 'string') {
      props.markup = [props.markup]
    }

    // Convert into HTML
    const converted = []
    for (const markup of props.markup) {
      converted.push(marked(markup))
    }

    // Split large texts into smaller chunks
    const steps = []
    for (const html of converted) {
      const chunks = splitHtmlintoChunks(html)
      for (const chunk of chunks) {
        steps.push(chunk)
      }
    }

    props.markup = steps
    return props
  },
  stepCount (props) {
    return props.markup.length
  }
}

export default {
  props: {
    markup: {
      type: [String, Array],
      required: true
    }
  },
  computed: {
    stepNoCurrent () {
      return this.$store.getters.slideCurrent.master.stepNoCurrent
    },
    markupCurrent () {
      return this.markup[this.stepNoCurrent - 1]
    }
  }
}
</script>

<style lang="scss" scoped>
  .markdown-master {
    font-size: 2vw;
  }
</style>
