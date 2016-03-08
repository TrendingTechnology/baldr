#! /bin/sh

docker run \
	-it \
	--rm \
	--name build-song-cache \
	-v "$PWD":/usr/src/app \
	-w /usr/src/app \
	node:latest node js/build-song-cache.js
