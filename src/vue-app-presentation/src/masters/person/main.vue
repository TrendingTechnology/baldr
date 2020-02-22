<template>
  <div class="vc_person_master">
    <img class="img-contain" :src="imageHttpUrl">
    <p
      class="short-biography font-shadow"
      v-if="shortBiography"
      v-html="shortBiography"
    />
    <div class="info-box">
      <p
        class="birth-and-death font-shadow"
        v-if="birth || death"
      >
        {{ birth }} {{ death }}
      </p>
      <p class="person important transparent-background font-shadow">{{ name }}</p>
    </div>

    <div class="link-icons">
      <a v-if="wikipediaHttpUrl" :href="wikipediaHttpUrl">
        <plain-icon name="wikipedia"/>
      </a>
      <a v-if="wikidataHttpUrl" :href="wikidataHttpUrl">
        <plain-icon name="wikidata"/>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
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
    },
    shortBiography: {
      type: String
    },
    wikipediaHttpUrl: {
      type: String
    },
    wikidataHttpUrl: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_person_master {
    .short-biography {
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

      .birth-and-death {
        font-size: 2em;
        margin: 0;
        padding-right: 2em;
        text-align: right;
        margin-bottom: 0.4em;
      }

      .person {
        font-size: 4em;
        padding-right: 2em;
        text-align: right;
      }
    }

    .link-icons {
      opacity: 0.5;
      font-size: 1.5em;
      position: absolute;
      right: 1em;
      bottom: 9em;
      display: flex;
      flex-direction: column;
    }
  }
</style>
