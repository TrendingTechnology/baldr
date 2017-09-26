#! /bin/sh

# echo "1: $1 2: $2 3: $3" >> $HOME/debug_mscore-to-eps.sh

# 1: /home/jf/git-repositories/jf/html5-school-presentation/songbook/modules/library-update/songs/Zum-Tanze-da-geht-ein-Maedel/piano/piano.mscx
# 2:
# 3:

# one page:
# piano.eps

# two pages:
# piano_1.eps
# piano_2.eps

# Auf-der-Mauer_auf-der-Lauer:  1 page
# Swing-low:                    1 page
# Zum-Tanze-da-geht-ein-Maedel: 2 pages

_eps() {
	if [ -n "$2" ]; then
		local EPS=$(echo "$1" | sed "s#.mscx#_$2.eps#")
	else
		local EPS=$(echo "$1" | sed "s#.mscx#.eps#")
	fi
	echo "Test file" > "$EPS"
}

if [ "$3" = all ]; then
  echo "Test file" > "$2"
  exit 0
else
  exit 1
fi
