#! /bin/sh

# echo "1: $1 2: $2 3: $3" >> $HOME/debug_mscore-to-eps.sh

# 1: /home/jf/git-repositories/jf/html5-school-presentation/songbook/modules/library-update/songs/Zum-Tanze-da-geht-ein-Maedel/piano/piano.mscx
# 2:
# 3: 

if [ "$3" = all ]; then
  echo "Test file" > "$2"
  exit 0
else
  exit 1
fi
