<template>
  <div class="
    vc_question_master_preview
    slide-preview-fix-typography
    slide-preview-valign-center
    slide-preview-fullscreen
  ">
    <h1 v-if="heading" v-html="heading"/>
    <ol :class="{ numbers: showNumbers }">
      <li
        v-for="pair in questions"
        :key="pair.question"
      >
        <p class="question" v-html="pair.question"/>
      </li>
    </ol>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  props: {
    heading: {
      type: String
    },
    questions: {
      type: Array,
      required: true
    },
    numbers: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    showNumbers () {
      if (this.numbers && this.questions.length > 1) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_question_master_preview {
    padding: 3em;
    font-size: 1.2em;

    ol {
      padding-left: 2em;
    }
  }
</style>
