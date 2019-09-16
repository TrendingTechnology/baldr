<template>
  <div>
    <slide-number/>
    <master-renderer/>
  </div>
</template>

<script>
import MasterRenderer from './MasterRenderer.vue'
import SlideNumber from './SlideNumber.vue'

export default {
  name: 'SlideView',
  components: {
    MasterRenderer,
    SlideNumber
  }
}
</script>
