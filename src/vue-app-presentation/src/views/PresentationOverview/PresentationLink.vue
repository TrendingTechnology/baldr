<template>
  <span
    class="vc_presentation_link link"
    @click="openPresentation(id)"
  >
  {{ title }}
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
    }
  },
  methods: {
    openPresentation
  }
}
</script>
