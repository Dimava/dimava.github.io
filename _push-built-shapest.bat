
robocopy "../shapez.io/src/" "./" "index.html"

robocopy "../shapez.io/build/" "./shapez/shapest" /S

git add -A

git commit -m "_push-shapest"

git push
