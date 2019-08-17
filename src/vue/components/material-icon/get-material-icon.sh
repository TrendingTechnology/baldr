#! /bin/sh

wget -O src/icons/$1.svg https://raw.githubusercontent.com/Templarian/MaterialDesign/master/icons/svg/$1.svg

if [ ! "$?" -eq 0 ]; then
  rm -f src/icons/$1.svg
fi