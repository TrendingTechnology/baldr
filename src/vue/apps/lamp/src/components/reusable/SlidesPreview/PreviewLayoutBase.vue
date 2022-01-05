<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { createNamespacedHelpers } from 'vuex'

import {
  Slide as SlideNg,
  Presentation as PresentationNg
} from '@bldr/presentation-parser'

import { Slide, Presentation } from '../../../content-file.js'

import SlidePreview from '@/components/reusable/SlidesPreview/SlidePreview.vue'

const { mapGetters } = createNamespacedHelpers('lamp')
const storePreview = createNamespacedHelpers('lamp/preview')
const mapGettersPreview = storePreview.mapGetters

@Component({
  components: {
    SlidePreview
  },
  computed: {
    ...mapGetters([
      'presentation',
      'presentationNg',
      'slidesCount',
      'currentSlideNg',
      'currentSlide'
    ]),
    ...mapGettersPreview(['detail', 'hierarchical'])
  }
})
export default class LayoutBase extends Vue {
  @Prop({
    type: Array,
    required: true
  })
  slides!: Slide[]

  presentation!: Presentation
  presentationNg!: PresentationNg

  slidesCount!: number
  detail!: boolean
  hierarchical!: boolean

  currentSlide!: Slide
  currentSlideNg!: SlideNg

  gotToSlide (slideNo: number): void {
    this.$store.dispatch('lamp/setSlideNoCurrent', slideNo)
    if (this.$route.name !== 'slide') {
      this.$router.push({ name: 'slide' })
    }
  }
}
</script>
