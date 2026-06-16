#!/bin/zsh
set -e

cd "$(dirname "$0")"

HTML="$PWD/index.html"

echo "index 실행 스크립트"
echo "더블클릭으로 실행되지 않으면 터미널에서 다음을 실행하세요:"
echo "chmod +x \"$PWD/run_wolf.command\""

if [ ! -f "$HTML" ]; then
  osascript -e 'display alert "index.html을 찾을 수 없습니다" message "'"$HTML"'"'
  exit 1
fi

URL=$(python3 -c 'import pathlib, sys; print(pathlib.Path(sys.argv[1]).resolve().as_uri())' "$HTML")

open -na "Google Chrome" --args "--app=$URL" "--user-data-dir=$PWD/.chrome-wolf-profile"
