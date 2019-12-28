<template>
  <span class="vc_presentation_link">
    <span
      v-if="!hasChilds"
      class="link"
      @click="openPresentation(id)"
      :title="`ID: ${id}`"
    >
      {{ title }}
    </span>
    <span v-else>{{ title }}</span>
    <span v-if="subtitle">({{ subtitle }})</span>
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
    }
  },
  methods: {
    openPresentation
  }
}
</script>
