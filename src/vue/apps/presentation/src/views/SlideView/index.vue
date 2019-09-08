<template>
  <div>
    <slide-number/>
    <slide-renderer/>
  </div>
</template>

<script>
import SlideRenderer from './SlideRenderer.vue'
import SlideNumber from './SlideNumber.vue'

export default {
  name: 'SlideView',
  components: {
    SlideRenderer,
    SlideNumber
  }
}
</script>
