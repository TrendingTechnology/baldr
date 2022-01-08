#! /bin/bash

# Problems with lerna
# - lerna run test: Exits immediately
# - lerna run --no-bail test: Shows all packages green even if they fail
# - sinon mocks not working
# - problems with timeouts (rest-api, api-wrapper)

GLOBAL_EXIT_CODE=0

COUNTER_OK=0
COUNTER_FAILED=0

BASE_PATH="$(pwd)"
TMP_FILE=/tmp/bldr-test-output

_run() {
	local OUTPUT=
  local COMMAND="$1"
	local REL_PATH="$2"
	cd "$BASE_PATH/$REL_PATH"
	npm run "$COMMAND" &> $TMP_FILE
		if [ "$?" -eq 0 ]; then
		echo -e "$COMMAND \033[32mOK:\e[0m $REL_PATH"
		((COUNTER_OK++))
	else
		echo -e "$COMMAND \033[31mERROR:\e[0m $REL_PATH"
		cat "$TMP_FILE"
		((COUNTER_FAILED++))
		GLOBAL_EXIT_CODE=1
	fi
}

lerna bootstrap

# For @bldr/log
export FORCE_COLOR=true

_run test api/rest-api
_run test cli
_run test lib/browser/core-browser
_run test lib/browser/menu-adapter
_run test lib/node/audio-metadata
_run test lib/node/cli-utils
_run test lib/node/core-node
_run test lib/node/file-reader-writer
_run test lib/node/icon-font-generator
_run test lib/node/media-categories
_run test lib/node/media-data-collector
_run test lib/node/media-manager
_run test lib/node/mongodb-connector
_run test lib/node/open-with
_run test lib/node/seating-plan-converter
_run test lib/node/titles
_run test lib/node/vue-config-helper
_run test lib/node/wikidata
_run test lib/universal/api-wrapper
_run test lib/universal/client-media-models
_run test lib/universal/config
_run test lib/universal/dom-manipulator
_run test lib/universal/http-request
_run test lib/universal/log
_run test lib/universal/markdown-to-html
_run test lib/universal/media-resolver
_run test lib/universal/presentation-parser
_run test lib/universal/songbook-core
_run test lib/universal/string-format
_run test lib/universal/tex-templates
_run test lib/universal/transliterate
_run test lib/universal/universal-dom
_run test lib/universal/uuid
_run test lib/universal/yaml
_run test vue/apps/lamp
_run test vue/apps/songbook
_run test vue/test-apps/test-icons
_run test vue/test-apps/test-player
#_run_test api/wire
#_run_test lib/browser/media-resolver
#_run_test lib/browser/mousetrap-wrapper
#_run_test lib/browser/style-configurator
#_run_test lib/browser/tex-markdown-converter
#_run_test lib/browser/vue-packages-bundler
#_run_test lib/node/songbook-intermediate-files
#_run_test lib/universal/type-definitions
#_run_test vue/apps/seating-plan

_run build:webapp vue/apps/lamp
_run build:electron vue/apps/lamp
_run build:webapp vue/apps/songbook
_run build:electron vue/apps/songbook

echo
echo "OK: $COUNTER_OK FAILED: $COUNTER_FAILED"

exit "$GLOBAL_EXIT_CODE"
