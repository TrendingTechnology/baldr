#! /bin/sh

_transpile() {
  echo "cd $1"
  cd "$1";
  if [ ! -d "$1" ]; then
    exit 1
  fi
  rm -rf dist
  npm run build
  if [ "$?" != 0 ]; then
    exit 1
  fi
}

# First low level modules
DIRS="lib/browser/type-definitions
lib/browser/presentation-masters
lib/browser/presentation-parser
lib/browser/core-browser
lib/browser/http-request
lib/browser/tex-markdown-converter
lib/node/core-node
lib/node/config
lib/node/wikidata
lib/node/cli-utils
lib/node/media-manager
api/media-server
mgmt/cli"

for DIR in $DIRS; do
  DIR="$HOME/git-repositories/github/Josef-Friedrich/baldr/src/$DIR"
  echo "Transpile $DIR"
  _transpile "$DIR"
done
