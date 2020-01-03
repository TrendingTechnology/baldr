<template>
  <div class="vc_person_master">
    <img :src="imageHttpUrl">
    <div class="info-box">
      <p
        v-if="birth || death" class="birth-and-death"
      >
        {{ birth }} {{ death }}
      </p>
      <p class="person important">{{ name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      description: 'Der Name der Person',
      required: true
    },
    imageHttpUrl: {
      type: String,
      required: true
    },
    birth: {
      type: String
    },
    death: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_person_master {
    img {
      height: 100vh;
      left: 0;
      object-fit: contain;
      object-position: left bottom;
      position: absolute;
      top: 0;
      width: 100vw;
    }

    .info-box {
      bottom: 4vw;
      position: absolute;
      right: 0;
      width: 100%;

      .birth-and-death {
        font-size: 3vw;
        margin: 0;
        padding-right: 6vw;
        text-align: right;
      }

      .person {
        background: rgba(170, 170, 170, 0.3);
        font-size: 6vw;
        margin: 0;
        padding-right: 4vw;
        text-align: right;
      }
    }
  }
</style>
