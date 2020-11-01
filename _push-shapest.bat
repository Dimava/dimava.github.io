
cd "../shapez.io/gulp/"

cmd /c "yarn gulp build.prod"

echo "build complete"

cd "../../dimava.github.io/"

git pull --ff-only

robocopy "../shapez.io/src/" "./" "index.html"

robocopy "../shapez.io/build/" "./shapez/shapest" /S

git add -A

git commit -m "_push-shapest"

git push

pause
