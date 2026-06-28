# Wolf Text Export / Apply

Wolf의 `.twee` 원본에서 게임 화면 문구를 TSV로 추출하고, TSV의 `edited` 칸에 적은 수정문을 다시 원본에 반영하는 도구입니다.

## 1. 추출 방법

```bash
python3 tools/text/export_wolf_text.py
```

프로젝트 루트에 `wolf_text_export.tsv`가 생성됩니다. 기존 파일이 있으면 `wolf_text_export.prev.tsv`로 백업합니다.

## 2. TSV 수정 방법

TSV 컬럼은 아래 순서입니다.

```text
id	file	passage	kind	original	edited	note
```

- `original`: 현재 원문입니다.
- `edited`: 수정문을 적는 칸입니다.
- `edited`가 비어 있으면 apply 때 아무 것도 바꾸지 않습니다.
- `id`, `file`, `passage`, `kind`, `original`은 안전 확인에 쓰이므로 임의로 바꾸지 마세요.

## 3. 적용 방법

```bash
python3 tools/text/apply_wolf_text.py wolf_text_export.tsv
```

적용 전 현재 `src`를 다시 추출해서 TSV의 `id`와 `original`이 일치하는지 확인합니다. 일치하지 않는 행은 conflict로 보고하고 적용하지 않습니다.

## 4. git diff 확인 방법

```bash
git diff
```

매크로, target, 변수, passage 이름이 의도치 않게 바뀌지 않았는지 확인하세요.

## 5. 빌드 방법

```bash
TWEEGO_PATH=tools/tweego tools/tweego/tweego -o index.html src
```

`index.html`은 직접 수정하지 않고 빌드 산출물로만 갱신합니다.

## 6. 충돌이 났을 때

conflict가 난 행은 원본이 바뀌었거나 같은 id를 현재 소스에서 안전하게 찾지 못한 경우입니다.

1. `wolf_text_export.tsv`를 다시 생성합니다.
2. 새 TSV에서 같은 문구를 찾아 `edited`를 다시 입력합니다.
3. apply를 다시 실행합니다.

## 안전 장치

- apply 전 변경 대상 파일을 `tools/text/backups/YYYYMMDD_HHMMSS/` 아래에 백업합니다.
- `choiceTo`와 `link`는 첫 번째 문자열, 즉 화면에 보이는 라벨만 교체합니다.
- target 이름, passage 이름, 변수명, macro 구조는 교체 대상으로 삼지 않습니다.
- 넓은 정규식 치환이나 파일 전체 일괄 치환을 하지 않고, 현재 추출된 source span만 교체합니다.
