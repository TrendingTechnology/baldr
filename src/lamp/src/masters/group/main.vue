<template>
  <div class="vc_group_master">
    <img class="img-contain" :src="group.httpUrl">
    <p
      class="short-history font-shadow"
      v-if="group.shortHistory"
      v-html="group.shortHistory"
    />
    <div class="info-box">

      <p class="group important transparent-background font-shadow">{{ group.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mainImage: {
      type: String,
      required: true
    }
  },
  computed: {
    group () {
      return this.$store.getters['media/mediaFileByUri'](this.mainImage)
    }
  }
}
</script>

<style lang="scss">
  .vc_group_master {
    .short-history {
      font-style: italic;
      height: 10em;
      position: absolute;
      right: 2em;
      top: 2em;
      width: 20em;
    }

    .info-box {
      bottom: 3em;
      position: absolute;
      right: 0;
      width: 100%;

      .group {
        font-size: 4em;
        padding-right: 1em;
        text-align: right;
      }
    }

  }
</style>
