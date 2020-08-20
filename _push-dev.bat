
cd "../shapez.io/gulp/"

cmd /c "yarn gulp build.dev"

cmd /c "yarn gulp js.dev"

echo "build complete"

cd "../../dimava.github.io/"

git pull --ff-only

robocopy "../shapez.io/src/" "./" "index.html"

robocopy "../shapez.io/build/" "./shapez/modZ/dev/" /S

git add -A

git commit -m "_push"

git push
