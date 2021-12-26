<template>
  <div class="vc_question_master main-app-padding">
    <question v-if="question" :question="question" />
    <ol v-if="subQuestions">
      <li v-for="question in subQuestions" :key="question.question">
        <question :question="question" />
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import Question from './Question.vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { StepController } from '@bldr/dom-manipulator'

import MasterMain from '../../components/reusable/MasterMain.vue'

@Component({
  components: {
    Question
  }
})
export default class QuestionMasterMain extends MasterMain {
  masterName = 'question'

  @Prop({
    type: Array,
    required: true
  })
  questions: any

  stepController: StepController

  get subQuestions () {
    if (this.questions.length > 1) {
      return this.questions
    }
    return ''
  }

  get question () {
    if (this.questions.length === 1) {
      return this.questions[0]
    }
    return ''
  }

  data (): { stepController: StepController } {
    return {
      stepController: null
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

  .level-0 ol {
    list-style-type: decimal;
  }
  .level-1 ol {
    list-style-type: lower-alpha;
  }
  .level-2 ol {
    list-style-type: lower-roman;
  }

  .answer {
    font-style: italic;
    font-size: 0.8em;
  }
}
</style>
