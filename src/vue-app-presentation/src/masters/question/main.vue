<template>
  <div class="vc_question_master">
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
    },
    question () {
      if (this.questions.length === 1) {
        return this.questions[0]
      }
    }
  },
  methods: {
    setQuestionsBySetNo (newStepNo) {
      const slide = this.$get('slideCurrent')
      const sequence = slide.renderData.props.sequence

      const curId = sequence[newStepNo - 1]

      for (const id of sequence) {
        document.getElementById(id).classList.remove('active')
      }

      const isAnswer = curId.match(/^a/)
      const element = document.getElementById(curId)
      element.classList.add('active')
      if (isAnswer) {
        element.style.display = 'block'
      }
      if (newStepNo === 1) {
        window.scrollTo(0, 0)
      } else {
        element.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    }
  }
}
</script>

<style lang="scss">
  .vc_question_master {
    font-size: 2em;
    padding: 2em;

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
