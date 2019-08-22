import QuoteMaster from '@/masters/QuoteMaster'
import MarkdownMaster from '@/masters/MarkdownMaster'
import SlideRenderer from '@/views/SlideRenderer.vue'

const components = {
  QuoteMaster,
  MarkdownMaster
}

export const masterNames = [
  'quote',
  'markdown'
]

export function toClassName (masterName) {
  const titleCase = masterName.charAt(0).toUpperCase() + masterName.substr(1).toLowerCase()
  return `${titleCase}Master`
}

export function masterOptions (masterName) {
  return components[toClassName(masterName)]
}

function makeRouteObject (masterName, { path, title, data }) {
  return {
    path: path,
    title: title,
    component: SlideRenderer,
    meta: {
      master: masterName,
      data
    }
  }
}

function masterExample (masterName) {
  const options = masterOptions(masterName)
  if ('examples' in options) {
    const routes = []
    for (const example of options.examples) {
      routes.push(makeRouteObject(masterName, example))
    }
    return {
      path: masterName,
      title: masterName,
      component: SlideRenderer,
      children: routes
    }
  }
}

export function mastersExamples () {
  const routes = []
  for (const masterName of masterNames) {
    const examples = masterExample(masterName)
    if (examples) routes.push(examples)
  }
  return {
    path: '/examples',
    title: 'examples',
    component: SlideRenderer,
    children: routes
  }
}

export default {
  components
}
