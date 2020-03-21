<template>
  <div :class="['vc_question_master_question', `level-${q.level}`]">
    <h1 v-if="q.heading" v-html="q.heading"/>
    <p class="question" v-if="q.question" v-html="q.question" :id="`q${q.questionNo}`"/>
    <p class="answer" v-if="q.answer" v-html="q.answer" :id="`a${q.answerNo}`"/>
    <ol v-if="q.subQuestions">
      <li
        v-for="question in q.subQuestions"
        :key="question.question"
      >
        <question :question="question"/>
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

</style>
