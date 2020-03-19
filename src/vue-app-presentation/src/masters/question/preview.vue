<template>
  <div class="
    vc_question_master_preview
    slide-preview-fix-typography
    slide-preview-valign-center
    slide-preview-fullscreen
  ">
  </div>
</template>

<script>
import Question from './Question.vue'

export default {
  props: {
    questions: {
      type: Array,
      required: true
    }
  },
  components: {
    Question
  }
}
</script>

<style lang="scss">
  .vc_question_master_preview {
    ol {
      padding-left: 1em;
    }
  }
</style>
