#! /bin/sh

# echo "1: $1 2: $2 3: $3" >> $HOME/debug_mscore-to-eps.sh

# 1: /home/jf/git-repositories/jf/baldr/songbook/modules/library-update/songs/Zum-Tanze-da-geht-ein-Maedel/piano/piano.mscx
# 2:
# 3:

# one page:
# piano.eps

# two pages:
# piano_1.eps
# piano_2.eps

# Auf-der-Mauer:  1 page
# Swing-low:                    1 page
# Zum-Tanze-da-geht-ein-Maedel: 2 pages

_eps() {
	local EPS=$(echo "$1" | sed "s#.mscx#_$2.eps#")
	echo "Test file" > "$EPS"
}

if [ -n "$1" ] && [ "$1" != '--help' ]; then
	_eps "$1" 1
	_eps "$1" 2
	exit 0
else
	exit 1
fi
