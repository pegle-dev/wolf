#!/usr/bin/env python3
"""Apply edited Wolf TSV text back to Twee source files safely."""

from __future__ import annotations

import csv
import shutil
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import export_wolf_text as exporter


ROOT = Path(__file__).resolve().parents[2]
BACKUP_ROOT = ROOT / "tools" / "text" / "backups"
TSV_FIELDS = exporter.TSV_FIELDS


def read_rows(tsv_path: Path) -> list[dict[str, str]]:
    with tsv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        missing = [field for field in TSV_FIELDS if field not in (reader.fieldnames or [])]
        if missing:
            raise SystemExit(f"TSV 컬럼이 부족합니다: {', '.join(missing)}")
        return list(reader)


def current_entry_map(files: set[str]) -> tuple[dict[str, exporter.TextEntry], dict[str, list[str]]]:
    entries_by_id: dict[str, exporter.TextEntry] = {}
    duplicate_ids: dict[str, list[str]] = defaultdict(list)

    for rel in sorted(files):
        path = ROOT / rel
        if not path.exists():
            continue
        for entry in exporter.extract_file(path):
            if entry.id in entries_by_id:
                duplicate_ids[entry.id].append(rel)
            else:
                entries_by_id[entry.id] = entry

    return entries_by_id, duplicate_ids


def make_backup(path: Path, backup_dir: Path) -> Path:
    rel = path.relative_to(ROOT)
    target = backup_dir / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, target)
    return target


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("사용법: python3 tools/text/apply_wolf_text.py wolf_text_export.tsv")
        return 2

    tsv_path = Path(argv[1])
    if not tsv_path.is_absolute():
        tsv_path = ROOT / tsv_path
    if not tsv_path.exists():
        print(f"TSV 파일을 찾을 수 없습니다: {tsv_path}")
        return 2

    rows = read_rows(tsv_path)
    edited_rows = [row for row in rows if row.get("edited", "") != ""]
    if not edited_rows:
        print("적용할 edited 문구가 없습니다.")
        return 0

    files = {row["file"] for row in edited_rows}
    entries_by_id, duplicate_ids = current_entry_map(files)

    conflicts: list[str] = []
    changes_by_file: dict[str, list[tuple[exporter.TextEntry, str]]] = defaultdict(list)
    seen_tsv_ids: set[str] = set()

    for row in edited_rows:
        row_id = row["id"]
        if row_id in seen_tsv_ids:
            conflicts.append(f"{row_id}: TSV 안에서 id가 중복되었습니다.")
            continue
        seen_tsv_ids.add(row_id)

        if row_id in duplicate_ids:
            conflicts.append(f"{row_id}: 현재 추출 결과에서 id가 중복되어 모호합니다.")
            continue

        entry = entries_by_id.get(row_id)
        if entry is None:
            conflicts.append(f"{row_id}: 현재 src에서 같은 id를 찾지 못했습니다.")
            continue

        if entry.file != row["file"] or entry.passage != row["passage"]:
            conflicts.append(
                f"{row_id}: 파일 또는 passage가 현재 추출 결과와 다릅니다 "
                f"({entry.file} / {entry.passage})."
            )
            continue

        if entry.original != row["original"]:
            conflicts.append(f"{row_id}: original이 현재 원본과 일치하지 않습니다.")
            continue

        changes_by_file[entry.file].append((entry, row["edited"]))

    if not changes_by_file:
        print("적용 가능한 변경이 없습니다.")
        if conflicts:
            print("\nConflicts:")
            for conflict in conflicts:
                print(f"- {conflict}")
        return 1 if conflicts else 0

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = BACKUP_ROOT / timestamp
    changed_files: list[str] = []

    for rel, changes in sorted(changes_by_file.items()):
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")

        sorted_changes = sorted(changes, key=lambda item: item[0].start, reverse=True)
        occupied: list[tuple[int, int]] = []
        for entry, _edited in sorted_changes:
            if any(not (entry.end <= start or entry.start >= end) for start, end in occupied):
                conflicts.append(f"{entry.id}: 변경 범위가 다른 변경과 겹칩니다.")
                continue
            occupied.append((entry.start, entry.end))

        applicable = [
            (entry, edited)
            for entry, edited in sorted_changes
            if not any(
                conflict.startswith(f"{entry.id}: 변경 범위")
                for conflict in conflicts
            )
        ]
        if not applicable:
            continue

        make_backup(path, backup_dir)
        for entry, edited in applicable:
            replacement = (
                exporter.escape_twee_string(edited)
                if entry.replace_mode == "quoted"
                else edited
            )
            current = text[entry.start : entry.end]
            expected = (
                exporter.escape_twee_string(entry.original)
                if entry.replace_mode == "quoted"
                else entry.original
            )
            if current != expected:
                conflicts.append(f"{entry.id}: 적용 직전 source span이 예상과 다릅니다.")
                continue
            text = text[: entry.start] + replacement + text[entry.end :]

        path.write_text(text, encoding="utf-8")
        changed_files.append(rel)

    print(f"적용한 행 수: {sum(len(v) for v in changes_by_file.values())}")
    print(f"변경된 파일 수: {len(changed_files)}")
    for rel in changed_files:
        print(f"- {rel}")
    if changed_files:
        print(f"백업 폴더: {backup_dir}")
        print("적용 후 반드시 확인하세요: git diff")

    if conflicts:
        print("\nConflicts:")
        for conflict in conflicts:
            print(f"- {conflict}")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
