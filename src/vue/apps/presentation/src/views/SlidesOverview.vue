<template>
  <div class="vc_slides_overview default-padding" b-content-theme="default">
    <div class="view-mode" @click="switchViewMode">
      <a href="#" v-if="!viewModeCompact">kompakt</a>
      <a href="#" v-if="viewModeCompact">ausführlich</a>
    </div>
    <h1>Überblick</h1>
    <ol v-if="slides">
      <li
        v-for="slide in slides"
        :key="slide.no"
        @click="gotToSlide(slide.no)"
        :title="`Zur Folie Nr. ${slide.no}`"
      >
        <div class="master-info">
          <material-icon
            :name="slide.master.icon"
            :color="slide.master.color"
          />
          <span class="master-title"> {{ slide.master.title }}</span>
        </div>

        <div class="slide-title indent">{{ slide.title }}</div>
        <div class="plain-text indent" v-if="!viewModeCompact">{{ slide.plainText }}</div>
      </li>
    </ol>
    <open-interface v-else/>
  </div>
</template>

<script>
import OpenInterface from '@/components/OpenInterface'

export default {
  name: 'SlidesOverview',
  components: {
    OpenInterface
  },
  data () {
    return {
      viewModeCompact: true
    }
  },
  mounted: function () {
    this.$styleConfig.set({
      centerVertically: false,
      overflow: false
    })
  },
  computed: {
    slides () {
      if (this.$store.getters.slidesCount) {
        return this.$store.getters.slides
      }
    }
  },
  methods: {
    gotToSlide (slideNo) {
      this.$store.dispatch('setSlideNoCurrent', slideNo)
      this.$router.push('/slides')
    },
    switchViewMode () {
      this.viewModeCompact = !this.viewModeCompact
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_slides_overview {
    font-size: 1.5vw;
    box-sizing: border-box;
    height: 100vh;

    .view-mode {
      position: absolute;
      top: 2vw;
      right: 2vw;
    }

    .indent {
      padding-left: 2.5vw;
    }

    .master-info {
      font-size: 1.5em;
    }

    h1 {
      font-size: 1.4em;
    }

    li {
      cursor: pointer;
      list-style-type: none;

      &:hover {
        background-color: scale-color($gray, $lightness: 80%);
      }

      .master-title {
        font-weight: bold;
        font-family: $font-family-sans;
      }

      .plain-text {
        font-size: 0.5em;
        color: $gray;
      }
    }
  }
</style>
