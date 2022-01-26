<script lang="ts">
import Component from 'vue-class-component'

import Master from './Master.vue'
import SlidePreviewPlayButton from '../components/reusable/SlidesPreview/SlidePreviewPlayButton.vue'

@Component({
  components: {
    SlidePreviewPlayButton
  }
})
export default class MasterPreview extends Master {}
</script>
