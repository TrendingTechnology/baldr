<template>
  <div class="vc_sample_list_master">
    <h2 v-if="heading" v-html="heading"/>
    <ol :class="cssClassNotNumbered">
      <li
        v-for="wrappedSample in samples.samples"
        :key="wrappedSample.uri"
      >
        <play-button
          :sample="wrappedSample.sample"
        />
        <span v-html="wrappedSample.title"/>
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
    // WrappedSampleList
    samples: {
      type: Object,
      required: true
    },
    notNumbered: {
      type: Boolean
    }
  },
  computed: {
    cssClassNotNumbered () {
      return {
        'not-numbered': this.notNumbered
      }
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

      &.not-numbered {
        list-style-type: none;
      }

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
