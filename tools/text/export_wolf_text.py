#!/usr/bin/env python3
"""Export editable Wolf text from Twee source files to TSV.

The extractor is intentionally conservative: it only records text spans that
look like player-facing strings and keeps enough source-position metadata for
apply_wolf_text.py to re-locate the same span safely.
"""

from __future__ import annotations

import csv
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List


ROOT = Path(__file__).resolve().parents[2]
SRC_DIR = ROOT / "src"
OUT_FILE = ROOT / "wolf_text_export.tsv"
PREV_FILE = ROOT / "wolf_text_export.prev.tsv"

TSV_FIELDS = ["id", "file", "passage", "kind", "original", "edited", "note"]

PASSAGE_RE = re.compile(r"(?m)^::\s+([^\s{]+)[^\n]*\n?")
CHOICE_RE = re.compile(r"<<\s*(choiceTo|link)\s+\"((?:\\.|[^\"\\])*)\"", re.S)
TALK_RE = re.compile(r"<<\s*talk\b[^>]*>>(.*?)<<\s*/talk\s*>>", re.S)
TAG_RE = re.compile(
    r"<(?P<tag>div|span|button|a|strong|p)\b(?P<attrs>[^>]*)>(?P<body>.*?)</(?P=tag)>",
    re.S | re.I,
)
CLASS_RE = re.compile(r"class\s*=\s*\"([^\"]*)\"", re.I)

CLASS_KIND_RULES = [
    ("recordbook-item-title", "recordbook"),
    ("recordbook-item-desc", "recordbook"),
    ("recordbook-summary", "recordbook"),
    ("recordbook-section-title", "recordbook"),
    ("recordbook-title", "recordbook"),
    ("recordbook-subtitle", "recordbook"),
    ("recordbook-wolf-state-title", "ui"),
    ("recordbook-wolf-state-row", "ui"),
    ("ending-stamp", "ending_title"),
    ("choice-prompt", "narration"),
    ("narration", "narration"),
    ("narration-block", "narration"),
    ("narration-full", "narration"),
    ("dialogue-box", "dialogue"),
    ("dialogue", "dialogue"),
    ("game-title", "ui"),
    ("game-subtitle", "ui"),
    ("game-tagline", "ui"),
    ("title-menu-item", "ui"),
    ("hidden-revival-title", "ui"),
    ("wolf-toast", "toast"),
    ("wolf-state-label", "ui"),
]


@dataclass(frozen=True)
class TextEntry:
    id: str
    file: str
    passage: str
    kind: str
    original: str
    note: str
    start: int
    end: int
    replace_mode: str = "text"


@dataclass(frozen=True)
class Passage:
    name: str
    start: int
    body_start: int
    end: int
    body: str


def rel_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def safe_id_part(value: str) -> str:
    cleaned = re.sub(r"[^0-9A-Za-z가-힣_]+", "_", value)
    return re.sub(r"_+", "_", cleaned).strip("_") or "root"


def unescape_twee_string(value: str) -> str:
    return value.replace(r"\"", '"').replace(r"\\", "\\")


def escape_twee_string(value: str) -> str:
    return value.replace("\\", r"\\").replace('"', r"\"")


def split_passages(text: str) -> List[Passage]:
    matches = list(PASSAGE_RE.finditer(text))
    passages: List[Passage] = []
    if not matches:
        return [Passage("StoryData", 0, 0, len(text), text)]

    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        passages.append(
            Passage(
                name=match.group(1),
                start=match.start(),
                body_start=match.end(),
                end=end,
                body=text[match.end() : end],
            )
        )
    return passages


def is_visible_text(value: str) -> bool:
    compact = value.strip()
    if not compact:
        return False
    if compact in {"?", "??", "???", "…"}:
        return True
    return bool(re.search(r"[A-Za-z가-힣0-9\[\]]", compact))


def trim_span(source: str, start: int, end: int) -> tuple[int, int]:
    while start < end and source[start].isspace():
        start += 1
    while end > start and source[end - 1].isspace():
        end -= 1
    return start, end


def class_kind(attrs: str) -> str | None:
    class_match = CLASS_RE.search(attrs)
    if not class_match:
        return None
    classes = set(class_match.group(1).split())
    for class_name, kind in CLASS_KIND_RULES:
        if class_name in classes:
            return kind
    return None


def text_segments(body: str, absolute_start: int) -> Iterable[tuple[int, int, str]]:
    pos = 0
    text_start = 0

    def emit_until(limit: int):
        nonlocal text_start
        start, end = trim_span(body, text_start, limit)
        if start < end:
            original = body[start:end]
            if is_visible_text(original):
                yield absolute_start + start, absolute_start + end, original

    while pos < len(body):
        if body.startswith("<<", pos):
            yield from emit_until(pos)
            close = body.find(">>", pos + 2)
            pos = len(body) if close == -1 else close + 2
            text_start = pos
            continue
        if body[pos] == "<":
            yield from emit_until(pos)
            close = body.find(">", pos + 1)
            pos = len(body) if close == -1 else close + 1
            text_start = pos
            continue
        pos += 1

    yield from emit_until(len(body))


def extract_from_passage(path: Path, text: str, passage: Passage) -> List[TextEntry]:
    entries: List[TextEntry] = []
    seen_spans: set[tuple[int, int]] = set()
    rel = rel_path(path)

    def add(kind: str, original: str, start: int, end: int, note: str, mode: str = "text"):
        if (start, end) in seen_spans:
            return
        if not is_visible_text(original):
            return
        seen_spans.add((start, end))
        index = len(entries) + 1
        entry_id = (
            f"{safe_id_part(rel)}__{safe_id_part(passage.name)}__{index:03d}"
        )
        entries.append(
            TextEntry(
                id=entry_id,
                file=rel,
                passage=passage.name,
                kind=kind,
                original=original,
                note=note,
                start=start,
                end=end,
                replace_mode=mode,
            )
        )

    for match in CHOICE_RE.finditer(passage.body):
        macro = match.group(1)
        raw = match.group(2)
        raw_start = passage.body_start + match.start(2)
        raw_end = passage.body_start + match.end(2)
        add("choice", unescape_twee_string(raw), raw_start, raw_end, f"{macro} label", "quoted")

    for match in TALK_RE.finditer(passage.body):
        body = match.group(1)
        absolute = passage.body_start + match.start(1)
        for start, end, original in text_segments(body, absolute):
            add("dialogue", original, start, end, "talk block")

    for match in TAG_RE.finditer(passage.body):
        kind = class_kind(match.group("attrs"))
        if not kind:
            continue
        body = match.group("body")
        absolute = passage.body_start + match.start("body")
        for start, end, original in text_segments(body, absolute):
            add(kind, original, start, end, "HTML text")

    return entries


def extract_file(path: Path) -> List[TextEntry]:
    text = path.read_text(encoding="utf-8")
    entries: List[TextEntry] = []
    for passage in split_passages(text):
        entries.extend(extract_from_passage(path, text, passage))
    return entries


def extract_all() -> tuple[list[TextEntry], int, int]:
    paths = sorted(SRC_DIR.rglob("*.twee"))
    entries: List[TextEntry] = []
    passage_count = 0
    for path in paths:
        text = path.read_text(encoding="utf-8")
        passages = split_passages(text)
        passage_count += len(passages)
        for passage in passages:
            entries.extend(extract_from_passage(path, text, passage))
    return entries, len(paths), passage_count


def write_tsv(entries: Iterable[TextEntry], output: Path = OUT_FILE) -> None:
    if output.exists():
        shutil.copy2(output, PREV_FILE)
    with output.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=TSV_FIELDS, delimiter="\t")
        writer.writeheader()
        for entry in entries:
            writer.writerow(
                {
                    "id": entry.id,
                    "file": entry.file,
                    "passage": entry.passage,
                    "kind": entry.kind,
                    "original": entry.original,
                    "edited": "",
                    "note": entry.note,
                }
            )


def main() -> int:
    entries, file_count, passage_count = extract_all()
    write_tsv(entries)
    print(f"추출한 파일 수: {file_count}")
    print(f"추출한 passage 수: {passage_count}")
    print(f"추출한 문구 수: {len(entries)}")
    print(f"출력 파일 경로: {OUT_FILE}")
    if PREV_FILE.exists():
        print(f"이전 TSV 백업: {PREV_FILE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
