#! /bin/sh

if [ -z "$" ]; then
	COMMAND=$(basename $0)
	echo "Usage: $COMMAND <command>

e. g. 
  - $COMMAND node script.js
  - $COMMAND npm -g list
"
	exit 1
fi

docker run \
	-it \
	--rm \
	--name my-running-script \
	-v "$PWD":/usr/src/app \
	-w /usr/src/app \
	node:latest $@

