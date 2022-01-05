<template>
  <ol class="vc_list_layout">
    <li
      v-for="slide in slides"
      :key="slide.no"
      @click="gotToSlide(slide.no)"
      :title="`Zur Folie Nr. ${slide.no}`"
      :class="{ 'current-slide': currentSlide && slide.no === currentSlide.no }"
      :style="style(slide)"
    >
      <slide-preview
        :slide="slide"
        :slide-ng="presentationNg.getSlideByNo(slide.no)"
      />
      <div class="slide-info">
        <span class="master-title"> {{ slide.master.title }}: </span>
        <span class="slide-title" v-html="slide.title" />
        <div class="plain-text" v-if="!detail">{{ slide.plainText }}</div>
      </div>
    </li>
  </ol>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import { Slide } from '../../../content-file.js'

import PreviewLayoutBase from '@/components/reusable/SlidesPreview/PreviewLayoutBase.vue'

@Component
export default class ListLayout extends PreviewLayoutBase {
  style (slide: Slide) {
    if (this.hierarchical) {
      const padding = (slide.level - 1) * 8
      return { paddingLeft: `${padding}em` }
    }
  }
}
</script>

<style lang="scss">
.vc_list_layout {
  li {
    display: flex;
    cursor: pointer;
    list-style-type: none;
    padding: 0.5em;

    .slide-info {
      font-size: 2em;
      padding-left: 1em;
    }

    &:hover {
      background-color: scale-color($gray, $lightness: 80%);
    }

    &.current-slide {
      background-color: scale-color($yellow, $lightness: 80%);
    }

    &.current-slide:hover {
      background-color: scale-color($yellow, $lightness: 50%);
    }

    .master-title {
      font-weight: bold;
      font-family: $font-family-sans;
    }

    .plain-text {
      color: $gray;
    }
  }
}
</style>
