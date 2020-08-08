
git pull --ff-only

robocopy "../shapez.io/src/" "./" "index.html"

robocopy "../shapez.io/build" "./shapez/modZ" /S

git add -A

git commit -m "_push"

git push

