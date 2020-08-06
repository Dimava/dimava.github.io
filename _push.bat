
rmdir "./shapez/modZ" /S /Q

xcopy "../shapez.io/build" "./shapez/modZ" /E /H /C /I

git add -A

git commit -m "_push"

git push

