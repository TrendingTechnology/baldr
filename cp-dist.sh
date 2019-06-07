#! /bin/sh

sudo rsync -av --delete \
    masters/songbook/packages/electron-app/dist/@bldr-songbook-electron-app-darwin-x64/@bldr-songbook-electron-app.app/ \
    /Applications/Songbook.app/
