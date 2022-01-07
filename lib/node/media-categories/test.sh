#! /bin/sh

TEST_DIR="/data/school/Aktuell/Musik/10/10_Kontext/40_Jazz/20_Vorformen/10_Worksongs-Spirtuals/QL"

DEST="$TEST_DIR/Thema-Musik_Jazz.pdf"

echo "$DEST"

npm run build
rm -f "$DEST.yml"
cp -f "$TEST_DIR/old.yml" "$DEST.yml"
baldr -vvv normalize "$DEST"
