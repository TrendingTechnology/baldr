import { player } from '@bldr/player'
import { shortcutManager } from '@bldr/shortcuts'
import * as api from '@bldr/api-wrapper'
import {
  Presentation as PresentationNg,
  resolver
} from '@bldr/presentation-parser'

import { Presentation } from '@/content-file.js'
import Vm from '../main'

function registerPresentationRelatedShortcuts () {
  const samples = resolver.exportSamples()
  for (const sample of samples) {
    if (sample.shortcut != null) {
      shortcutManager.addNg({
        keys: sample.shortcut,
        callback: () => {
          // TODO: Start the same video twice behaves very strange.
          // this.canvas.hide()
          player.load(sample.ref)
          player.start()
          // if (sample.asset.isVisible) {
          //   this.canvas.show(sample.htmlElement)
          // }
        },
        description: `Spiele Ausschnitt „${sample.titleSafe}“`,
        group: 'playable'
      })
    }
  }
}

function getRawYamlExampleByRef (ref: string): string | undefined {
  let rawYamlString: string | undefined

  // master example
  const masterMatch = ref.match(/^EP_master_(.*)$/)
  if (masterMatch != null) {
    rawYamlString = rawYamlExamples.masters[masterMatch[1]]
  }

  // common example
  const commonMatch = ref.match(/^EP_common_(.*)$/)
  if (commonMatch != null) {
    rawYamlString = rawYamlExamples.common[commonMatch[1]]
  }

  return rawYamlString
}

export async function loadPresentation (
  vm: typeof Vm,
  ref: string,
  reload = false
): Promise<void> {
  if (!reload) {
    player.stop()
    shortcutManager.removeByGroup('playable')
    // To show the loader
    vm.$store.dispatch('lamp/clearPresentation')
    resolver.reset()
    vm.$store.dispatch('lamp/media/clear')
  }

  // Get the yaml content as a string of a presentation for quick refresh
  let rawYamlString: string | undefined
  let rawPresentation

  rawYamlString = getRawYamlExampleByRef(ref)

  if (rawYamlString == null) {
    rawPresentation = await api.getPresentationByRef(ref)
    rawYamlString = await api.readMediaAsString(rawPresentation.meta.path)
  }

  const presentationNg = PresentationNg.mergeYamlStringWithRaw(
    rawYamlString,
    rawPresentation
  )
  await presentationNg.resolve()
  registerPresentationRelatedShortcuts()

  // @TODO remove
  const presentation = new Presentation(rawYamlString)
  await presentation.resolveMedia(vm)

  await vm.$store.dispatch('lamp/loadPresentation', {
    presentation,
    presentationNg,
    reload
  })
}
