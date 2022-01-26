<template>
  <div
    class="vc_speaker_view main-app-fullscreen"
    b-ui-theme="default"
    v-if="presentation"
  >
    <presentation-title />

    <div class="slide-panel" v-if="slide">
      <slide-main
        id="current-slide"
        :slide="slide"
        :slide-ng="slideNg"
        :step-no="currentStepNo"
      />
      <div>
        <slide-main
          id="next-slide"
          :slide="nextSlide"
          :slide-ng="nextSlideNg"
          :step-no="nextStepNo"
          :is-public="false"
        />
        <slide-steps />
      </div>
    </div>

    <grid-layout :slides="presentation.slides" />

    <router-link
      class="open-public-view"
      :to="publicViewRoute"
      target="_blank"
      title="zusätzliche Präsentations-Ansicht öffnen"
    >
      <plain-icon name="presentation" />
    </router-link>

    <cursor-arrows />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'
import { Route } from 'vue-router'

import { Slide as SlideNg, Presentation } from '@bldr/presentation-parser'
import { Slide } from '../../../content-file.js'

import { routerGuards, switchRouterView } from '../../../lib/routing-related'

import CursorArrows from '@/components/reusable/CursorArrows.vue'
import GridLayout from '@/components/reusable/SlidesPreview/GridLayout.vue'
import PresentationTitle from '@/components/reusable/PresentationTitle.vue'
import SlideMain from '@/components/reusable/SlideMain/index.vue'
import SlideSteps from './SlideSteps.vue'

const { mapGetters } = createNamespacedHelpers('presentation')
const mapGettersNav = createNamespacedHelpers('presentation/nav').mapGetters

interface RouterParams {
  slideNo: number
  stepNo?: number
  presRef: string
}

@Component({
  components: {
    CursorArrows,
    GridLayout,
    PresentationTitle,
    SlideMain,
    SlideSteps
  },
  computed: {
    ...mapGetters([
      'slide',
      'slideNg',
      'presentation',
      'presentationNg',
      'slides',
      'slidesNg'
    ]),
    ...mapGettersNav(['nextRouterParams'])
  },
  ...routerGuards
})
export default class SpeakerView extends Vue {
  slide!: Slide

  slideNg!: SlideNg

  slides!: Slide[]

  slidesNg!: SlideNg[]

  presentationNg!: Presentation

  nextRouterParams!: (direction: 1 | -1) => RouterParams

  get nextSlideRouterParams (): RouterParams {
    return this.nextRouterParams(1)
  }

  get nextSlide (): Slide {
    const params = this.nextSlideRouterParams
    return this.slides[params.slideNo - 1]
  }

  get nextSlideNg (): SlideNg {
    const params = this.nextSlideRouterParams
    return this.slidesNg[params.slideNo - 1]
  }

  get currentStepNo (): number {
    return this.slide.stepNo
  }

  get nextStepNo (): number | undefined {
    return this.nextSlideRouterParams.stepNo
  }

  get publicViewRoute (): Route | undefined {
    return switchRouterView(this.$route)
  }
}
</script>

<style lang="scss">
.vc_speaker_view {
  padding: 1em;

  .slide-panel {
    display: flex;
    font-size: 0.2vw;
    justify-content: space-between;
    padding: 1em;
  }

  #current-slide {
    font-size: 6em;
  }

  #next-slide {
    font-size: 4em;
  }

  .vc_slide_main {
    border: solid $black 1px;
    height: 30em;
    width: 40em;

    // See styling:
    // - components/SlideMain/MasterIcon.vue (Basic styling)
    // - routes/SpeakerView/index.vue (Adjustments for the speaker view)
    // - routes/SlideView/index.vue (Adjustments for the main slide view)
    .vc_master_icon {
      font-size: 3em;
      height: 1em;
      line-height: 1em;
      left: 0.2em;
      top: 0.2em;

      &.small {
        font-size: 2em;
      }

      &.large {
        font-size: 4em;
      }
    }
    .vc_external_sites {
      font-size: 1em;
    }
  }

  .vc_slide_steps {
    width: 40em;
  }

  .vc_master_renderer {
    height: 30em;
  }

  .vc_slide_preview {
    font-size: 0.3em;
  }

  .vc_presentation_title {
    ul,
    h1,
    h2,
    nav {
      display: inline;
      font-size: 0.7em;
      margin: 0;
      padding: 0;
    }

    h1,
    h2 {
      &:before {
        content: ' / ';
      }
    }

    h2 {
      font-size: 0.6em;
    }
  }

  .left-bottom-corner,
  .vc_audio_overlay {
    bottom: 0.5em;
    left: 0.5em;
    position: absolute;
    z-index: 1;
  }

  .vc_play_button {
    font-size: 1em;
  }

  .open-public-view {
    bottom: 0.3em;
    left: 0.3em;
    position: fixed;
  }
}
</style>
