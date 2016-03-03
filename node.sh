#! /bin/sh

docker run \
	-it \
	--rm \
	--name my-running-script \
	-v "$PWD":/usr/src/app \
	-w /usr/src/app \
	node:latest node $@
