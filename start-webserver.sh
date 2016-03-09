#! /bin/sh

NAME='html5-presentation'
PORT='8080'
HTML_FOLDER=$(pwd)

echo "Serving '$HTML_FOLDER' on port '$PORT'.
Go to http://localhost:$PORT
"

{
  sleep 3
  xdg-open http://localhost:8080
} &

docker run \
	--rm \
	--name $NAME \
	-v "$HTML_FOLDER:/usr/share/nginx/html:ro" \
	-v "$HOME/git-repositories/schule/songbook:/usr/share/nginx/html/songbook/songs:ro" \
	--publish "$PORT:80" \
	nginx

