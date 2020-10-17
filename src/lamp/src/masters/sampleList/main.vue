<template>
  <div class="vc_sample_list_master">
    <h2 v-if="heading" v-html="heading"/>
    <ol>
      <li
        v-for="wrappedSample in samples.samples"
        :key="wrappedSample.uri"
      >
        <play-button
          :sample="wrappedSample.sample"
        />
        <span v-html="wrappedSample.titleSafe"/>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: String
    },
    samples: {
      type: Array
    }
  }
}
</script>

<style lang="scss">
  .vc_sample_list_master {
    h2 {
      margin: 4em;
    }
    ol {
      margin: 6em;
      li {
        margin-bottom: 1em;
      }
      .vc_play_button {
        transform: translateY(0.2em);
        margin: 0 0.2em;
      }
    }
  }
</style>
