#! /bin/bash



CWD="$(pwd)"

DIR_PARENT='/var/data/baldr'
DIR_JSDOC="$DIR_PARENT/jsdoc"
DIR_SRC="$DIR_PARENT/src"
DIR_GH_PAGES="$DIR_PARENT/gh-pages"

function _setup_repo () {
	local REPO_PATH BRANCH_NAME
	REPO_PATH="$1"
	BRANCH_NAME="$2"
	if [ ! -d "$REPO_PATH" ]; then
		mkdir -p "$REPO_PATH"
	fi
	if [ ! -d "$REPO_PATH/.git" ]; then
		mkdir -p "$REPO_PATH"
		git clone git@github.com:Josef-Friedrich/baldr.git -b "$BRANCH_NAME" "$REPO_PATH"
	fi
}

# JSDOC
_setup_repo "$DIR_JSDOC" 'jsdoc'

# SRC
_setup_repo "$DIR_SRC" 'master'
cd "$DIR_SRC"
git pull

# GH_PAGES
_setup_repo "$DIR_GH_PAGES" 'gh-pages'
cd $DIR_GH_PAGES
git pull
rm -rf *

cd "$CWD"

function _install_node_dependencies() {
	npm install -g jsdoc
	npm install -g jsdoc-vuejs
	npm install -g vue-template-compiler
	#npm install -g documentation
}

function _separate_packages() {
	PACKAGES=(
		'masters/songbook/src/base:songbook-base'
		'masters/songbook/src/cli:songbook-cli'
		'masters/songbook/src/core:songbook-core'
		'masters/songbook/src/intermediate-files:songbook-intermediate-files'
		'src/api-media-server:api-media-server'
		'src/api-seating-plan:api-seating-plan'
		'src/api:api'
		'src/core-browser:core-browser'
		'src/core:core'
		'src/http-request:http-request'
		'src/vue/apps/presentation:presentation'
		'src/vue/apps/seating-plan:seating-plan'
		'src/vue/apps/showroom:showroom'
		'src/vue/apps/songbook:songbook-vue-app'
		'src/vue/components/collection:vue-components-collection'
		'src/vue/components/dynamic-select:vue-component-dynamic-select'
		'src/vue/components/material-icon:vue-component-material-icon'
		'src/vue/components/media:vue-media'
		'src/vue/components/modal-dialog:vue-component-modal-dialog'
		'src/vue/components/shortcuts:vue-shortcuts'
		'themes/default:theme-default'
		'themes/handwriting:theme-handwriting'
	)
	cat index_header.html > "$DIR_GH_PAGES/index.html"

	for i in "${PACKAGES[@]}"; do
		REL_PATH=${i%%:*}
		PACKAGE_NAME=${i#*:}
		jsdoc --configure ./jsdoc-config.json --destination "$DIR_GH_PAGES/$PACKAGE_NAME" "$DIR_SRC/$REL_PATH"
		#documentation build "$DIR_SRC/$REL_PATH/**" --format html --output "$DIR_GH_PAGES/$PACKAGE_NAME"
		echo "<li><a href=\"$PACKAGE_NAME/index.html\">@bldr/$PACKAGE_NAME</a></li>" >> "$DIR_GH_PAGES/index.html"
	done

	cat index_footer.html >> "$DIR_GH_PAGES/index.html"
}

function _one_big_package() {
	jsdoc \
		--configure ./jsdoc-config.json \
		--destination "$DIR_GH_PAGES" \
		"$DIR_SRC"
}

_one_big_package

xdg-open "$DIR_GH_PAGES/index.html" &
