// https://raw.githubusercontent.com/silasmontgomery/dynamic-select/master/src/DynamicSelect.vue
<template>
  <div>
    <div
      tabindex="0"
      @focusin="hasFocus=true"
      class="dynamic-select"
    >
      <input
        @focus="hasFocus=true"
        :placeholder="placeholder"
        autocomplete="off"
        class="search"
        ref="search"
        v-model="searchText"
        @keyup="moveToResults"
        @keydown="removeOption"
      />
      <div
        v-if="showResultList"
        ref="resultList"
        class="result-list"
      >
        <div
          tabindex="0"
          ref="result"
          class="result"
          v-for="result in results"
          :key="result[optionValue]"
          v-html="highlight(result[optionText])"
          @click="selectOption(result)"
          @keyup.prevent="navigateResults(result, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    },
    optionValue: {
      type: String,
      default: 'id',
      required: true
    },
    optionText: {
      type: String,
      default: 'name',
      required: true
    },
    value: {
      default: function () {
        return null
      },
      required: false
    }
  },
  data: function () {
    return {
      hasFocus: false,
      searchText: null,
      selectedOption: this.value,
      selectedResult: 0
    }
  },
  computed: {
    results: function () {
      // Filter items on search text (if not empty, case insensitive) and when item isn't already selected (else return all items not selected)
      if (this.searchText) {
        return this.options.filter((option) => {
          let optionText = String(option[this.optionText]).toLowerCase()
          return optionText.includes(this.searchText.toLowerCase())
        })
      } else {
        return this.options
      }
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
      if (hasFocus) {
        this.$refs.search.focus()
      } else {
        this.searchText = null
        this.selectedResult = 0
        this.$refs.search.blur()
      }
    },
    value: function () {
      // Load selected option on prop value change
      this.options.forEach(option => {
        if (this.value && option[this.optionValue] === this.value[this.optionValue]) {
          this.selectedOption = option
        }
      })
    },
    search: function () {
      // Provide search text to parent (for ajax fetching, etc)
      this.$emit('search', this.searchText)
    },
    selectedOption: function () {
      // Provide selected item to parent
      this.$emit('input', this.selectedOption)
    }
  },
  methods: {
    highlight: function (value) {
      // Highlights the part of each result that matches the search text
      if (this.searchText) {
        let matchPos = String(value).toLowerCase().indexOf(this.searchText.toLowerCase())
        if (matchPos > -1) {
          let matchStr = String(value).substr(matchPos, this.searchText.length)
          value = String(value).replace(matchStr, '<span style="font-weight: bold; background-color: #efefef;">' + matchStr + '</span>')
        }
      }
      return value
    },
    moveToResults: function (event) {
      // Move down to first result if user presses down arrow (from search field)
      if (event.keyCode === 40) {
        if (this.$refs.result.length > 0) {
          this.$refs.resultList.children.item(0).focus()
        }
      }
    },
    navigateResults: function (option, event) {
      // Add option to selected items on enter key
      if (event.keyCode === 13) {
        this.selectOption(option)
        // Move up or down items in result list with up or down arrow keys
      } else if (event.keyCode === 40 || event.keyCode === 38) {
        if (event.keyCode === 40) {
          this.selectedResult++
        } else if (event.keyCode === 38) {
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
      if (event.keyCode === 8 && (this.searchText == null || this.searchText === '')) {
        this.selectedOption = null
        this.hasFocus = false
      }
    },
    selectOption: function (option) {
      this.selectedOption = option
      this.hasFocus = false
    }
  }
}
</script>

<style scoped>
  .dynamic-select {
    border: 1px solid #ced4da;
    position: relative;
    padding: .375em .5em;
    cursor: text;
    display: block;
  }
  .dynamic-select .result-list {
    border: 1px solid #ced4da;
    margin: calc(.375em - 1px) calc(-.5em - 1px);
    width: 100%;
    cursor: pointer;
    position: absolute;
    z-index: 10;
    background-color: #fff;
  }
  .dynamic-select .result-list .result {
    padding: .375em .75em;
    color: #333;
  }
  .dynamic-select .result-list .result:hover,
  .dynamic-select .result-list .result:focus {
    background-color: #efefef;
    outline: none;
  }
  .dynamic-select .selected-option {
    display: inline-block;
  }
  .dynamic-select .search {
    border: none;
    width: 100%;
  }
  .dynamic-select .search:focus {
    outline: none;
  }
</style>
