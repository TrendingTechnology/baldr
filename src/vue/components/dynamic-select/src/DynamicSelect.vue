// https://github.com/silasmontgomery/vue-dynamic-select
// https://raw.githubusercontent.com/silasmontgomery/vue-dynamic-select/master/src/DynamicSelect.vue
<template>
  <div
    @focusin="hasFocus=true"
    class="vc_dynamic_select"
    tabindex="0"
  >
    <input
      :placeholder="placeholder"
      @focus="hasFocus=true"
      @keydown="removeOption"
      @keyup="moveToResults"
      autocomplete="off"
      class="search"
      ref="search"
      v-model="searchText"
    />
    <div
      class="result-list"
      ref="resultList"
      v-if="showResultList"
    >
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

<script>
import DynamicSelect from './main.js'

const resultListMaxCount = 20

export default {
  name: 'DynamicSelect',
  props: {
    placeholder: {
      type: String,
      default: 'search',
      required: false
    },
    options: {
      type: Array,
      default: function () {
        return []
      },
      required: true
    }
  },
  data: function () {
    return {
      hasFocus: false,
      searchText: null,
      selectedOption: null,
      selectedResult: 0
    }
  },
  mounted () {
    DynamicSelect.event.$on('dynamicselectfocus', this.focus)
    // Activate a keyboard listener for the enter key only if
    // the text search field is focues.
    const searchInput = this.$refs.search
    searchInput.addEventListener('focus', () => {
      searchInput.addEventListener('keydown', this.selectFirstItemOnReturn)
    })
   searchInput.addEventListener('blur', () => {
      searchInput.removeEventListener('keydown', this.selectFirstItemOnReturn)
    })
  },
  created () {
    this.searchDebounced = this.debounced(500, this.search)
  },
  computed: {
    results: function () {
      // Filter items on search text (if not empty, case insensitive) and when
      // item isn't already selected (else return all items not selected)
      let list
      if (this.searchText) {
        list = this.options.filter((option) => {
          let optionText = String(option.name).toLowerCase()
          return optionText.includes(this.searchText.toLowerCase())
        })
      } else {
        list = this.options
      }
      list = list.slice(0, resultListMaxCount)
      return list
    },
    showPlaceholder: function () {
      return !this.hasFocus && !this.selectedOption
    },
    showResultList: function () {
      return this.hasFocus && this.results.length > 0
    }
  },
  watch: {
    hasFocus: function (hasFocus) {
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
    },
    searchText: function () {
      this.searchDebounced(this.searchText)
    },
    selectedOption: function () {
      // Provide selected item to parent
      this.$emit('input', this.selectedOption)
    }
  },
  methods: {
    // https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
    debounced (delay, fn) {
      let timerId
      return function (...args) {
        if (timerId) {
          clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
          fn(...args)
          timerId = null
        }, delay)
      }
    },
    search (searchText) {
      this.$emit('search', searchText)
    },
    highlight: function (value) {
      // Highlights the part of each result that matches the search text
      if (this.searchText) {
        let matchPos = String(value).toLowerCase().indexOf(this.searchText.toLowerCase())
        if (matchPos > -1) {
          let matchStr = String(value).substr(matchPos, this.searchText.length)
          value = String(value).replace(matchStr, `<span style="font-weight: bold;">${matchStr}</span>`)
        }
      }
      return value
    },
    moveToResults: function (event) {
      // Move down to first result if user presses down arrow (from search field)
      if (event.key === 'ArrowDown') {
        if (this.$refs.result.length > 0) {
          this.$refs.resultList.children.item(0).focus()
        }
      }
    },
    navigateResults: function (option, event) {
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
        let next = this.$refs.resultList.children.item(this.selectedResult)
        if (next) {
          next.focus()
        } else {
          this.selectedResult = 0
          this.$refs.search.focus()
        }
      }
    },
    removeOption: function (event) {
      // Remove selected option if user hits backspace on empty search field
      if (event.key === 'Backspace' && (this.searchText == null || this.searchText === '')) {
        this.selectedOption = null
        this.hasFocus = false
      }
    },
    selectOption: function (option) {
      this.selectedOption = option
      this.hasFocus = false
    },
    focus: function () {
      this.hasFocus = true
    },
    preventDefaultCursorKeys: function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
      }
    },
    /**
     * This callback is only active when the text search field has focus.
     * It selects the first item in the search list. Auto select of
     * the last shown item was buggy.
     */
    selectFirstItemOnReturn: function (event) {
      if (event.key === 'Enter') {
        this.$refs.resultList.children[0].focus()
      }
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
