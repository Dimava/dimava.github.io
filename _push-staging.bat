
cd "../shapez.io/gulp/"

cmd /c "yarn gulp build.staging"

echo "build complete"

cd "../../dimava.github.io/"

git pull --ff-only

robocopy "../shapez.io/src/" "./" "index.html"

robocopy "../shapez.io/build/" "./shapez/modZ/staging/" /S

git add -A

git commit -m "_push-staging"

git push
