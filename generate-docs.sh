#! /bin/sh

CWD=$(pwd)

DIR_PARENT=/var/data/baldr
DIR_SRC=$DIR_PARENT/src
DIR_GH_PAGES=$DIR_PARENT/gh-pages

mkdir -p $DIR_SRC
mkdir -p $DIR_GH_PAGES

git clone git@github.com:Josef-Friedrich/baldr.git -b master $DIR_SRC
cd $DIR_SRC
git pull

git clone git@github.com:Josef-Friedrich/baldr.git -b gh-pages $DIR_GH_PAGES
cd $DIR_GH_PAGES
git pull
rm -rf *

cd $CWD

jsdoc --configure ./jsdoc-config.json --destination $DIR_GH_PAGES $DIR_SRC

xdg-open $DIR_GH_PAGES/index.html
