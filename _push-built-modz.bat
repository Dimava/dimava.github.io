
robocopy "../shapez.io/src/" "./" "index.html"

robocopy "../shapez.io/build/" "./shapez/modz" /S

git add -A

git commit -m "_push-modz"

git push
