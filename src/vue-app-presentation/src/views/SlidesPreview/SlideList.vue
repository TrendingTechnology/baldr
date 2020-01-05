<template>
  <ol v-if="slides">
    <li
      v-for="slide in slides"
      :key="slide.no"
      :title="`Zur Folie Nr. ${slide.no}`"
      :class="{ 'current-slide': slideCurrent.no === slide.no }"
    >
      <hr v-if="slide.slides.length" />
      <div class="slide-preview-wrapper" @click="gotToSlide(slide.no)">
        <slide-preview :slide="slide"/>
      </div>
      <material-icon
        :name="slide.master.icon.name"
        :color="slide.master.icon.color"
        outline="circle"
      />
      <slide-list v-if="slide.slides.length" :slides="slide.slides"/>
    </li>
  </ol>
</template>

<script>
import SlidePreview from './SlidePreview.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'SlideList',
  props: {
    slides: {
      type: Array
    }
  },
  components: {
    SlidePreview
  },
  computed: mapGetters([
    'slideCurrent'
  ]),
  methods: {
    gotToSlide (slideNo) {
      this.$store.dispatch('presentation/setSlideNoCurrent', slideNo)
      if (this.$route.name !== 'slides') this.$router.push({ name: 'slides' })
    }
  }
}
</script>


<style lang="scss" scoped>

  hr {
    width: 100vw;
    opacity: 0;
  }

  ol {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 3em;
    padding-top: 1em;
    overflow: hidden;
  }

  li {
    list-style: none;
    position: relative;
    margin: 0.3em;
  }

  .slide-preview-wrapper {
    background-color: $black;
    border: 1px solid $gray;
    color: $white;
    height: 15em;
    margin: 0em;
    overflow: hidden;
    width: 20em;
  }


  .baldr-icon {
    font-size: 2.5em;
    left: -0.3em;
    position: absolute;
    top: -0.3em;
  }

</style>
