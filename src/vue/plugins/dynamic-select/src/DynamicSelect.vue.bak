<template>
  <div @focusin="hasFocus = true" class="vc_dynamic_select" tabindex="0">
    <input
      :placeholder="placeholder"
      @focus="hasFocus = true"
      @keydown="removeOption"
      @keyup="moveToResults"
      autocomplete="off"
      class="search"
      ref="search"
      v-model="searchText"
    />
    <div class="result-list" ref="resultList" v-if="showResultList">
      <div
        :key="result.id"
        @click="selectOption(result)"
        @keyup.prevent="navigateResults(result, $event)"
        class="result"
        ref="result"
        tabindex="0"
        v-for="result in results"
        v-html="highlight(result.name)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Plugin from './main.js'
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'

const resultListMaxCount = 20

interface Option {
  ref: string
  name: string
}

@Component()
export default class DynamicSelect extends Vue {
  hasFocus = false
  searchText = null
  selectedOption: Option
  selectedResult = 0

  @Prop({
    type: String,
    default: 'search',
    required: false
  })
  placeholder!: string

  @Prop({
    type: Array,
    default: function () {
      return []
    }
  })
  options!: Option[]

  mounted () {
    Plugin.event.$on('dynamicselectfocus', this.focus)
    // Activate a keyboard listener for the enter key only if
    // the text search field is focues.
    const searchInput = this.$refs.search
    if (searchInput instanceof Element) {
      searchInput.addEventListener('focus', () => {
        searchInput.addEventListener('keydown', this.selectFirstItemOnReturn)
      })
      searchInput.addEventListener('blur', () => {
        searchInput.removeEventListener('keydown', this.selectFirstItemOnReturn)
      })
    }
  }

  get results () {
    // Filter items on search text (if not empty, case insensitive) and when
    // item isn't already selected (else return all items not selected)
    let list: Option[]
    if (this.searchText) {
      list = this.options.filter(option => {
        let optionText = String(option.name).toLowerCase()
        return optionText.includes(this.searchText.toLowerCase())
      })
    } else {
      list = this.options
    }
    list = list.slice(0, resultListMaxCount)
    return list
  }

  get showPlaceholder () {
    return !this.hasFocus && !this.selectedOption
  }

  get showResultList () {
    return this.hasFocus && this.results.length > 0
  }

  @Watch('hasFocus')
  onHasFocusChanged (hasFocus) {
    // Clear the search box when component loses focus
    window.removeEventListener('keydown', this.preventDefaultCursorKeys)
    if (hasFocus) {
      window.addEventListener('keydown', this.preventDefaultCursorKeys)
      this.$refs.search.focus()
    } else {
      this.searchText = null
      this.selectedResult = 0
      this.$refs.search.blur()
    }
  }

  @Watch('searchText', { immediate: true, deep: true })
  onSearchTextChanged () {
    this.searchDebounced(this.searchText)
  }

  @Watch('selectedOption', { immediate: true, deep: true })
  onSelectedOptionChanged () {
    // Provide selected item to parent
    this.$emit('input', this.selectedOption)
  }

  // https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
  debounced (delay: number, fn) {
    let timerId: number
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId)
      }
      timerId = setTimeout(() => {
        fn(...args)
        timerId = null
      }, delay)
    }
  }

  search (searchText: string) {
    this.$emit('search', searchText)
  }

  searchDebounced (searchText: string) {
    return this.debounced(500, () => {
      this.search(searchText)
    })
  }

  highlight (value) {
    // Highlights the part of each result that matches the search text
    if (this.searchText) {
      let matchPos = String(value)
        .toLowerCase()
        .indexOf(this.searchText.toLowerCase())
      if (matchPos > -1) {
        let matchStr = String(value).substr(matchPos, this.searchText.length)
        value = String(value).replace(
          matchStr,
          `<span style="font-weight: bold;">${matchStr}</span>`
        )
      }
    }
    return value
  }

  moveToResults (event) {
    // Move down to first result if user presses down arrow (from search field)
    if (event.key === 'ArrowDown') {
      if (this.$refs.result.length > 0) {
        this.resultListElement.children.item(0).focus()
      }
    }
  }

  @Ref('result')
  resultElement: Element

  @Ref('resultList')
  resultListElement: Element

  @Ref('search')
  searchElement: Element

  navigateResults (option, event) {
    // Add option to selected items on enter key
    if (event.key === 'Enter') {
      this.selectOption(option)
      // Move up or down items in result list with up or down arrow keys
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (event.key === 'ArrowDown') {
        this.selectedResult++
      } else if (event.key === 'ArrowUp') {
        this.selectedResult--
      }
      let next = this.resultListElement.children.item(this.selectedResult)
      if (next) {
        next.focus()
      } else {
        this.selectedResult = 0
        this.$refs.search.focus()
      }
    }
  }

  removeOption (event) {
    // Remove selected option if user hits backspace on empty search field
    if (
      event.key === 'Backspace' &&
      (this.searchText == null || this.searchText === '')
    ) {
      this.selectedOption = null
      this.hasFocus = false
    }
  }

  selectOption (option: Option): void {
    this.selectedOption = option
    this.hasFocus = false
  }

  focus (): void {
    this.hasFocus = true
  }

  preventDefaultCursorKeys (event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
    }
  }

  /**
   * This callback is only active when the text search field has focus.
   * It selects the first item in the search list. Auto select of
   * the last shown item was buggy.
   */
  selectFirstItemOnReturn (event) {
    if (event.key === 'Enter') {
      this.resultListElement.children[0].focus()
    }
  }
}
</script>

<style lang="scss" scoped>
$padding-left-right: 0.3em;

.vc_dynamic_select {
  position: relative;

  .result-list {
    background-color: scale-color($white, $lightness: -1%);
    border: 1px solid $gray;
    border-top: 0;
    box-sizing: border-box;
    cursor: pointer;
    position: absolute;
    width: 100%;
    z-index: 10;

    .result {
      color: $black;
      padding: 0.2em $padding-left-right;
      &:hover,
      &:focus {
        background-color: scale-color($yellow, $lightness: 70%);
        outline: none;
      }
    }
  }

  .selected-option {
    display: inline-block;
  }

  input.search {
    border: 1px solid $gray;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    padding: 0.5em $padding-left-right;
    width: 100%;

    &:focus {
      outline: none;
    }
  }
}
</style>
