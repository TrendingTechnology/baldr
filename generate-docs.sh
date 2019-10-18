#! /bin/bash

PACKAGES=(
	'src/vue/apps/presentation:presentation'
)

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

# npm install -g jsdoc
# npm install -g jsdoc-vuejs
# npm install -g vue-template-compiler

for i in "${PACKAGES[@]}"; do
	REL_PATH=${i%%:*}
	PACKAGE_NAME=${i#*:}
	jsdoc --configure ./jsdoc-config.json --destination $DIR_GH_PAGES/$PACKAGE_NAME $DIR_SRC/$REL_PATH
done


xdg-open $DIR_GH_PAGES/presentation/index.html
