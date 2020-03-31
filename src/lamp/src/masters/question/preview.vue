<template>
  <div class="
    vc_question_master_preview
    slide-preview-fix-typography
    slide-preview-valign-center
    slide-preview-fullscreen
  ">
    <question v-if="question" :question="question" no-answer/>
    <ol v-if="subQuestions">
      <li
        v-for="question in subQuestions"
        :key="question.question"
      >
        <question :question="question" no-answer/>
      </li>
    </ol>
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
  },
  computed: {
    subQuestions () {
      if (this.questions.length > 1) {
        return this.questions
      }
    },
    question () {
      if (this.questions.length === 1) {
        return this.questions[0]
      }
    }
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
