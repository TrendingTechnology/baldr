<template>
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
</template>

<script>
export default {
  name: 'BrandName'
}
</script>

<style lang="scss" scoped>
  .brand {
    display: flex;
    padding: 3vw 0;
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
