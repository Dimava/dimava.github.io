
robocopy "../shapez.io/src/" "./" "index.html"

robocopy "../shapez.io/build/" "./shapez/playZ" /S

git add -A

git commit -m "_push-built"

git push
