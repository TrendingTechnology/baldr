<template>
  <span class="vc_presentation_link" :class="`level-${level}`">
    <span
      v-if="!hasChilds"
      class="title link"
      @click="openPresentation(id)"
      :title="`ID: ${id}`"
    >
      {{ title }}
    </span>
    <span class="title" v-else>{{ title }}</span>
    <span class="subtitle" v-if="subtitle"> - {{ subtitle }}</span>
  </span>
</template>

<script>
import { openPresentation } from '@/lib.js'

export default {
  name: 'PresentationLink',
  props: {
    id: {
      type: String
    },
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    hasChilds: {
      type: Boolean
    },
    level: {
      type: Number
    }
  },
  methods: {
    openPresentation
  }
}
</script>

<style lang="scss" scoped>
  .level-1 .title {
    font-family: $font-family-sans;
    font-size: 1.6em;
    font-weight: bold;
  }

  .level-2 .title {
    font-family: $font-family-sans;
    font-weight: bold;
    font-size: 1.4em;
  }

  .level-3 .title {
    font-family: $font-family-sans;
    font-size: 1.2em;
  }

  .subtitle {
    font-style: italic;
  }
</style>
