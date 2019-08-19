<template>
  <main>
    <section class="main-project-logo">
       <material-icon name="baldr"/>
    </section>


    <section class="sub-projects">
      <circle-icon href="https://baldr.friedrich.rocks/seating-plan" icon="seat-outline"/>
      <circle-icon href="https://baldr.friedrich.rocks/songbook" icon="music" color="green"/>
      <circle-icon icon="cctv" color="red"/>
    </section>
  </main>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style lang="scss" scoped>
  .main-project-logo {
    text-align: center;
  }
  .baldr-icons-baldr {
    font-size: 50vw;
    color: $purple !important;
  }

  .sub-projects {
    display: flex;
    justify-content: space-around;
  }
</style>