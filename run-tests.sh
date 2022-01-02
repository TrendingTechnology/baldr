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

_run_test() {
	local OUTPUT=
	local REL_PATH="$1"
	cd "$BASE_PATH/src/$REL_PATH"
	npm run test &> $TMP_FILE
		if [ "$?" -eq 0 ]; then
		echo -e "\033[32mOK:\e[0m $REL_PATH"
		((COUNTER_OK++))
	else
		echo -e "\033[31mERROR:\e[0m $REL_PATH"
		cat "$TMP_FILE"
		((COUNTER_FAILED++))
		GLOBAL_EXIT_CODE=1
	fi
}

# For @bldr/log
export FORCE_COLOR=true

_run_test api/rest-api
#_run_test api/wire
_run_test cli
_run_test lib/browser/client-media-models
_run_test lib/browser/core-browser
_run_test lib/browser/dom-manipulator
#_run_test lib/browser/media-resolver
_run_test lib/browser/menu-adapter
#_run_test lib/browser/mousetrap-wrapper
#_run_test lib/browser/songbook-core
#_run_test lib/browser/style-configurator
#_run_test lib/browser/tex-markdown-converter
_run_test lib/browser/tex-templates
#_run_test lib/browser/vue-packages-bundler
_run_test lib/node/audio-metadata
_run_test lib/node/cli-utils
_run_test lib/node/core-node
_run_test lib/node/file-reader-writer
_run_test lib/node/icon-font-generator
_run_test lib/node/media-categories
_run_test lib/node/media-data-collector
_run_test lib/node/media-manager
_run_test lib/node/mongodb-connector
_run_test lib/node/open-with
_run_test lib/node/seating-plan-converter
#_run_test lib/node/songbook-intermediate-files
_run_test lib/node/titles
_run_test lib/node/vue-config-helper
_run_test lib/node/wikidata
_run_test lib/universal/api-wrapper
_run_test lib/universal/config
_run_test lib/universal/http-request
#_run_test lib/universal/log
_run_test lib/universal/markdown-to-html
_run_test lib/universal/media-resolver-ng
_run_test lib/universal/presentation-parser
_run_test lib/universal/string-format
_run_test lib/universal/transliterate
#_run_test lib/universal/type-definitions
_run_test lib/universal/universal-dom
_run_test lib/universal/uuid
_run_test lib/universal/yaml
_run_test vue/apps/lamp
#_run_test vue/apps/seating-plan
_run_test vue/apps/songbook
#_run_test vue/plugins/components-collection
#_run_test vue/plugins/dynamic-select
#_run_test vue/plugins/icons
#_run_test vue/plugins/media-client
#_run_test vue/plugins/menu-webapp
#_run_test vue/plugins/modal-dialog
#_run_test vue/plugins/notification
#_run_test vue/plugins/player
#_run_test vue/plugins/shortcuts
#_run_test vue/plugins/themes

echo
echo "OK: $COUNTER_OK FAILED: $COUNTER_FAILED"

exit "$GLOBAL_EXIT_CODE"
