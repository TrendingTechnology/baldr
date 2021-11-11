<template>
  <div :class="['vc_question_master_question', `level-${q.level}`]">
    <h1 v-if="q.heading" v-html="q.heading" />
    <p
      class="question"
      v-if="q.question"
      v-html="q.question"
      :id="`q${q.questionNo}`"
    />
    <p
      :id="`a${q.answerNo}`"
      class="answer"
      style="display: none;"
      v-html="q.answer"
      v-if="q.answer && !noAnswer"
    />
    <ol v-if="q.subQuestions">
      <li v-for="question in q.subQuestions" :key="question.question">
        <question :question="question" />
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'Question',
  props: {
    question: {
      type: Object
    },
    noAnswer: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    q () {
      return this.question
    }
  }
}
</script>

<style lang="scss">
.vc_question_master_question {
  .answer {
    em {
      font-weight: bold !important;
    }
  }
}
</style>
