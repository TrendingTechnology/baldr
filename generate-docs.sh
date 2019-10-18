#! /bin/sh

mkdir -p /var/data/baldr/src

git clone git@github.com:Josef-Friedrich/baldr.git /var/data/baldr/src

jsdoc --configure ./jsdoc-config.json --destination . /var/data/baldr/src
