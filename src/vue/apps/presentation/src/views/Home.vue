<template>
  <div>
    <section class="brand">
      <div>
        <material-icon
          size="20vw"
          outline="circle"
          name="presentation"
          color="orange"
        />
      </div>
      <div class="brand-name">
        <div>
          Baldr
        </div>
        <div>
          Presentation
        </div>
      </div>
    </section>
    <open-files/>
  </div>
</template>

<script>
import OpenFiles from './OpenFiles.vue'
export default {
  name: 'Home',
  components: {
    OpenFiles
  },
  created: function () {
    this.$centerVertically.set(true)
    this.$darkMode.set(false)
  }
}
</script>

<style lang="scss" scoped>
  .brand {
    display: flex;
    padding-bottom: 5vw;
    text-align: center;

    .brand-name {
      color: $orange;
      font-family: $font-family-sans-small-caps;
      font-size: 8vw;
      text-align: left;
      font-weight: bold;
      padding-left: 3vw;
      padding-top: 6vw;
    }
  }
</style>
