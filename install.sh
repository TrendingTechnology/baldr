#! /bin/sh

PARENT="$(pwd)"

_install() {
	cd "$PARENT/$1"
	npm install
}

npm install

_install themes/default
_install themes/handwriting
_install masters/audio
_install masters/markdown

cd "$PARENT"
