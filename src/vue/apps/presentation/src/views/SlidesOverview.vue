<template>
  <div class="slides-overview">
    <h1>Überblick über die Stunde</h1>
    <ol>
      <li
        v-for="slide in slides"
        :key="slide.no"
        @click="gotToSlide(slide.no)"
      >
        <material-icon
          :name="slide.masterObject.icon"
          :color="slide.masterObject.color"
        />
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'SlidesOverview',
  mounted: function () {
    this.$styleConfig.set({
      centerVertically: false,
      overflow: true
    })
  },
  computed: {
    slides () {
      return this.$store.getters.slides
    },
    getMaster (masterName) {
      return this.$masters[masterName]
    },
    masterIcon (masterName) {
      return this.getMaster(masterName).icon
    },
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

</style>
