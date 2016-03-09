#! /bin/sh

docker run \
	-it \
	--rm \
	--name build-song-cache \
	-v "$PWD":/usr/src/app \
	-v "$HOME/git-repositories/schule/songbook:/usr/src/app/songbook/songs" \
	-w /usr/src/app \
	node:latest node js/build-song-cache.js
