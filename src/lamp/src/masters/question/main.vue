<template>
  <div class="vc_question_master main-app-padding">
    <question v-if="question" :question="question"/>
    <ol v-if="subQuestions">
      <li
        v-for="question in subQuestions"
        :key="question.question"
      >
        <question :question="question"/>
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
      return ''
    },
    question () {
      if (this.questions.length === 1) {
        return this.questions[0]
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
  .vc_question_master {
    p {
      margin: 0;
      padding: 0.1em 0.3em;
    }

    .level-0 ol { list-style-type: decimal; }
    .level-1 ol { list-style-type: lower-alpha; }
    .level-2 ol { list-style-type: lower-roman; }

    .answer {
      font-style: italic;
      font-size: 0.8em
    }
  }
</style>
