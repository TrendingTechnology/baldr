#! /bin/sh

NAME='html5-presentation'
PORT='8080'
HTML_FOLDER=$(pwd)

trap "docker stop $NAME; docker rm $NAME" 2 15

echo "Serving '$HTML_FOLDER' on port '$PORT'.
Go to http://localhost:$PORT
"

docker run \
	--name $NAME \
	-v "$HTML_FOLDER:/usr/share/nginx/html:ro" \
	--publish "$PORT:80" \
	nginx

