#! /bin/sh

NAME='html5-presentation'
PORT='8080'
HTML_FOLDER=$(pwd)

if [ "$OS" = 'Darwin' ]; then
  URL='http://192.168.99.100'
else
  URL='http://localhost'
fi

echo "Serving '$HTML_FOLDER' on port '$PORT'.
Go to $URL:$PORT
"

{
  sleep 3
  if [ "$OS" = 'Darwin' ]; then
	  open http://192.168.99.100:$PORT
  else
  	xdg-open http://localhost:$PORT
  fi
} &

if [ -d $HOME/Desktop/school/songbook ]; then
	SONGBOOK=$HOME/Desktop/school/songbook
else
	SONGBOOK=$HOME/git-repositories/content/schule/songbook
fi

docker run \
	--rm \
	--name $NAME \
	-v "$HTML_FOLDER:/usr/share/nginx/html:ro" \
	-v "$SONGBOOK:/usr/share/nginx/html/songbook/songs:ro" \
	--publish "$PORT:80" \
	nginx

