#! /bin/sh

CWD=$(pwd)

DIR_PARENT=/var/data/baldr
DIR_JSDOC=$DIR_PARENT/jsdoc
DIR_SRC=$DIR_PARENT/src
DIR_GH_PAGES=$DIR_PARENT/gh-pages

# jsdoc
mkdir -p $DIR_JSDOC
git clone git@github.com:Josef-Friedrich/baldr.git -b jsdoc $DIR_JSDOC

# SRC
mkdir -p $DIR_SRC
git clone git@github.com:Josef-Friedrich/baldr.git -b master $DIR_SRC
cd $DIR_SRC
git pull

# GH_PAGES
mkdir -p $DIR_GH_PAGES
git clone git@github.com:Josef-Friedrich/baldr.git -b gh-pages $DIR_GH_PAGES
cd $DIR_GH_PAGES
git pull
rm -rf *

cd $CWD

npm install -g jsdoc
npm install -g jsdoc-vuejs
npm install -g vue-template-compiler

jsdoc --configure ./jsdoc-config.json --destination $DIR_GH_PAGES $DIR_SRC

xdg-open $DIR_GH_PAGES/index.html
