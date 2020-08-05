
del "./index.html"

xcopy "../shapez.io/src/index.html" "./index.html" /E /H /C /I

rmdir "./shapez/modZ" /S /Q

xcopy "../shapez.io/build" "./shapez/modZ" /E /H /C /I

git add -A

git commit -m "_push"

git push

