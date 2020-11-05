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
DIRS="type-definitions
presentation-masters
presentation-parser
config
core-browser
core-node
tex-markdown-converter
wikidata
cli-utils
media-manager
media-server"

for DIR in $DIRS; do
  DIR="$HOME/git-repositories/github/Josef-Friedrich/baldr/src/$DIR"
  echo "Transpile $DIR"
  _transpile "$DIR"
done
