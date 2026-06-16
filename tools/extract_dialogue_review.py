#!/usr/bin/env python3
"""Build a Markdown dialogue review file from the Wolf Twee source."""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path


ROUTE_ORDER = ("Intro", "Temple", "Hanbei", "Kuro", "Genichiro", "NightPatrol", "Other")
PASSAGE_RE = re.compile(r"^::\s+([^\s{\[]+)[^\n]*\n?", re.MULTILINE)
TALK_RE = re.compile(r"<<talk\s+([^>]*)>>(.*?)<</talk>>", re.DOTALL)
NARRATION_RE = re.compile(
    r"<div\s+class=(['\"])[^'\"]*\bnarration\b[^'\"]*\1\s*>(.*?)</div>",
    re.DOTALL | re.IGNORECASE,
)
CHOICE_BOX_RE = re.compile(
    r"<div\s+class=(['\"])[^'\"]*\bchoice-box\b[^'\"]*\1\s*>(.*?)</div>",
    re.DOTALL | re.IGNORECASE,
)
WIKI_LINK_RE = re.compile(r"\[\[([^\]|]+?)(?:->([^\]\[]+)|\|([^\]\[]+))?\](?:\[[^\]]*\])?\]")
LINK_MACRO_RE = re.compile(r"<<link\s+(['\"])(.*?)\1\s+(['\"])(.*?)\3.*?>>", re.DOTALL)


@dataclass
class Passage:
    name: str
    body: str


def find_source(root: Path, explicit: str | None) -> Path:
    if explicit:
        path = Path(explicit)
        return path if path.is_absolute() else root / path

    preferred = root / "Wolf.twee"
    if preferred.exists():
        return preferred

    candidates = sorted(root.glob("*.twee"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not candidates:
        raise FileNotFoundError("No .twee file found.")
    return candidates[0]


def split_passages(source: str) -> list[Passage]:
    matches = list(PASSAGE_RE.finditer(source))
    passages: list[Passage] = []

    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(source)
        passages.append(Passage(match.group(1), source[start:end].strip()))

    return passages


def route_for(name: str) -> str:
    for route in ROUTE_ORDER[:-1]:
        if name.startswith(route):
            return route
    return "Other"


def parse_macro_args(raw: str) -> list[str]:
    return [match.group(2) for match in re.finditer(r"(['\"])(.*?)\1", raw)]


def clean_text(text: str) -> str:
    text = re.sub(r"<<\/?page>>", "", text)
    text = re.sub(r"<<\/?talk[^>]*>>", "", text)
    text = re.sub(r"</?div[^>]*>", "", text)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"\n[ \t]+\n", "\n\n", text)
    text = "\n".join(line.rstrip() for line in text.splitlines())
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_choices(text: str) -> list[tuple[str, str | None]]:
    choices: list[tuple[str, str | None]] = []

    for match in WIKI_LINK_RE.finditer(text):
        label = clean_text(match.group(1))
        target = clean_text(match.group(2) or match.group(3) or "")
        if label:
            choices.append((label, target or None))

    for match in LINK_MACRO_RE.finditer(text):
        label = clean_text(match.group(2))
        target = clean_text(match.group(4))
        if label:
            choices.append((label, target or None))

    return choices


def remove_choice_markup(text: str) -> str:
    text = WIKI_LINK_RE.sub("", text)
    text = LINK_MACRO_RE.sub("", text)
    return text


def passage_blocks(body: str) -> list[tuple[int, str, object]]:
    blocks: list[tuple[int, str, object]] = []

    for match in TALK_RE.finditer(body):
        args = parse_macro_args(match.group(1))
        speaker = args[1] if len(args) > 1 else (args[0] if args else "화자")
        blocks.append((match.start(), "talk", (speaker, clean_text(match.group(2)))))

    for match in NARRATION_RE.finditer(body):
        blocks.append((match.start(), "narration", clean_text(remove_choice_markup(match.group(2)))))

    for match in CHOICE_BOX_RE.finditer(body):
        choices = extract_choices(match.group(2))
        if choices:
            blocks.append((match.start(), "choices", choices))

    covered = [m.span() for m in CHOICE_BOX_RE.finditer(body)]
    for match in list(WIKI_LINK_RE.finditer(body)) + list(LINK_MACRO_RE.finditer(body)):
        if any(start <= match.start() < end for start, end in covered):
            continue
        if match.re is WIKI_LINK_RE:
            label = clean_text(match.group(1))
            target = clean_text(match.group(2) or match.group(3) or "")
        else:
            label = clean_text(match.group(2))
            target = clean_text(match.group(4))
        if label:
            blocks.append((match.start(), "choices", [(label, target or None)]))

    return sorted(blocks, key=lambda item: item[0])


def render_passage(passage: Passage) -> str:
    chunks = [f"## {passage.name}"]

    for _, kind, value in passage_blocks(passage.body):
        if kind == "talk":
            speaker, line = value  # type: ignore[misc]
            chunks.append(f"[{speaker}]\n{line}".rstrip())
        elif kind == "narration":
            narration = str(value).strip()
            if narration:
                chunks.append(f"나레이션:\n{narration}")
        elif kind == "choices":
            choices = value  # type: ignore[assignment]
            lines = ["선택지:"]
            for label, target in choices:
                lines.append(f"* {label} -> {target}" if target else f"* {label}")
            chunks.append("\n".join(lines))

    return "\n\n".join(chunks).rstrip()


def build_review(passages: list[Passage]) -> str:
    grouped: dict[str, list[Passage]] = {route: [] for route in ROUTE_ORDER}

    for passage in passages:
        if not passage_blocks(passage.body):
            continue
        grouped[route_for(passage.name)].append(passage)

    output: list[str] = []
    for route in ROUTE_ORDER:
        route_passages = grouped[route]
        if not route_passages:
            continue
        output.append(f"# {route}")
        output.extend(render_passage(passage) for passage in route_passages)

    return "\n\n".join(output).strip() + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract Wolf dialogue and narration for review.")
    parser.add_argument("source", nargs="?", help="Twee source file. Defaults to Wolf.twee.")
    parser.add_argument("-o", "--output", default="dialogue_review.md", help="Markdown output path.")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    source = find_source(root, args.source)
    output = Path(args.output)
    if not output.is_absolute():
        output = root / output

    passages = split_passages(source.read_text(encoding="utf-8"))
    output.write_text(build_review(passages), encoding="utf-8")
    print(f"Wrote {output}")


if __name__ == "__main__":
    main()
