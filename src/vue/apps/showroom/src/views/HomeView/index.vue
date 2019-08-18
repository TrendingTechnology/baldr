<template>
  <main>
    <section class="sub-projects">
      <circle-icon href="https://baldr.friedrich.rocks/seating-plan" icon="seat-outline"/>
      <circle-icon href="https://baldr.friedrich.rocks/songbook" icon="music" color="green"/>
      <circle-icon icon="cctv" color="red"/>
    </section>
  </main>
</template>

<script>
import CircleIcon from './CircleIcon'

export default {
  name: 'HomeView',
  components: {
    CircleIcon
  }
}
</script>

<style lang="scss" scoped>
  .sub-projects {
    display: flex;
    justify-content: space-around;
  }
</style>