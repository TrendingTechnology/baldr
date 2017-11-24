#! /bin/sh

PARENT="$(pwd)"

_install() {
	cd "$PARENT/$1"
	npm install
}

npm install

_install src/app
_install src/lib
_install themes/default
_install themes/handwriting
_install masters/audio
_install masters/markdown
_install masters/editor

cd "$PARENT"
