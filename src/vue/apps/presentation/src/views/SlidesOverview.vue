<template>
  <div class="vc_slides_overview default-padding" b-content-theme="default">
    <h1>Überblick</h1>
    <ol v-if="slides">
      <li
        v-for="slide in slides"
        :key="slide.no"
        @click="gotToSlide(slide.no)"
        :title="`Zur Folie Nr. ${slide.no}`"
      >
        <material-icon
          :name="slide.master.icon"
          :color="slide.master.color"
        />
        <span class="master-title"> {{ slide.master.title }}</span>
        {{ slide.title }}
        <span class="plain-text">{{ slide.plainText }}</span>
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_slides_overview {
    font-size: 1.5vw;

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
      }

      .plain-text {
        font-size: 0.5em;
        color: $gray;
      }
    }
  }
</style>
