#!/usr/bin/env python3
"""Build a deterministic coverage ledger for long Chinese meeting transcripts.

This utility exposes candidate evidence. It does not decide whether a statement
is a final decision and does not replace a full semantic review.
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path


HEADER_RE = re.compile(
    r"^\s*说话人\s*(?P<speaker>\d+)\s+(?P<time>\d{1,2}:\d{2}:\d{2})\s*$"
)

CATEGORY_PATTERNS = {
    "身份": re.compile(r"我是|我叫|叫我|名字是|说话人\s*\d+"),
    "分工": re.compile(
        r"负责|分给|交给|你来|我来|你跟|我跟|一起做|共同做|配合|支援|"
        r"做.{0,12}(模块|控制台|客服|数据|文档|架构|前端|后端|数据库)"
    ),
    "决策": re.compile(
        r"就按|先这么|统一按|决定|定了|确定|最终|采用|不做|不要|删掉|"
        r"划掉|合并|归到|优先|先做|后置|改成|只能|不允许"
    ),
    "文档变更": re.compile(
        r"PRD|需求文档|需求表|文档|看板|写进去|补上|改一下|修改|删掉|"
        r"划掉|加一项|合并"
    ),
    "行动": re.compile(
        r"下周|明天|今天|月底|之前|之后|完成|输出|提交|同步|评审|确认|"
        r"测试|开会|早会|排期|todo|TODO"
    ),
    "风险": re.compile(
        r"风险|阻塞|卡点|依赖|前提|来不及|不确定|待确认|问题|冲突|"
        r"不能|没法|如果"
    ),
}


@dataclass
class Utterance:
    speaker: str
    seconds: int
    timestamp: str
    text: str


def parse_time(value: str) -> int:
    hours, minutes, seconds = (int(part) for part in value.split(":"))
    return hours * 3600 + minutes * 60 + seconds


def format_time(seconds: int) -> str:
    hours, remainder = divmod(max(seconds, 0), 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


def read_input(path: str) -> str:
    if path == "-":
        return sys.stdin.read()
    return Path(path).read_text(encoding="utf-8-sig")


def parse_transcript(text: str) -> list[Utterance]:
    utterances: list[Utterance] = []
    speaker = "未标注"
    timestamp = "00:00:00"
    seconds = 0
    buffer: list[str] = []

    def flush() -> None:
        nonlocal buffer
        content = " ".join(line.strip() for line in buffer if line.strip()).strip()
        if content:
            utterances.append(Utterance(speaker, seconds, timestamp, content))
        buffer = []

    for line in text.splitlines():
        match = HEADER_RE.match(line)
        if match:
            flush()
            speaker = f"说话人{match.group('speaker')}"
            timestamp = match.group("time")
            seconds = parse_time(timestamp)
        else:
            buffer.append(line)
    flush()
    return utterances


def shorten(text: str, limit: int = 120) -> str:
    compact = re.sub(r"\s+", " ", text).strip()
    if len(compact) <= limit:
        return compact
    return compact[: limit - 1] + "…"


def categories_for(text: str) -> list[str]:
    return [name for name, pattern in CATEGORY_PATTERNS.items() if pattern.search(text)]


def build_report(utterances: list[Utterance], window_minutes: int) -> str:
    if not utterances:
        raise ValueError("未识别到逐字稿内容。请确认格式包含“说话人N HH:MM:SS”。")

    window_seconds = window_minutes * 60
    duration = max(item.seconds for item in utterances)
    window_count = duration // window_seconds + 1
    window_stats: dict[int, Counter[str]] = defaultdict(Counter)
    window_speakers: dict[int, set[str]] = defaultdict(set)
    speaker_stats: dict[str, Counter[str]] = defaultdict(Counter)
    candidates: dict[str, list[Utterance]] = defaultdict(list)

    for item in utterances:
        window = item.seconds // window_seconds
        window_speakers[window].add(item.speaker)
        matched = categories_for(item.text)
        for category in matched:
            window_stats[window][category] += 1
            speaker_stats[item.speaker][category] += 1
            candidates[category].append(item)

    lines = [
        "# 长会议覆盖检查",
        "",
        f"- 逐字稿发言单元：{len(utterances)}",
        f"- 最后时间戳：{format_time(duration)}",
        f"- 时间窗口：{window_minutes} 分钟",
        "",
        "## 时间窗覆盖",
        "",
        "| 时间窗 | 已检查 | 发言人 | 身份 | 决策 | 分工 | 文档变更 | 行动 | 风险 |",
        "|---|---|---|---:|---:|---:|---:|---:|---:|",
    ]

    order = ["身份", "决策", "分工", "文档变更", "行动", "风险"]
    for window in range(window_count):
        start = window * window_seconds
        end = start + window_seconds - 1
        counts = window_stats[window]
        speakers = "、".join(sorted(window_speakers[window])) or "无"
        values = " | ".join(str(counts[name]) for name in order)
        lines.append(
            f"| {format_time(start)}–{format_time(end)} | 是 | {speakers} | {values} |"
        )

    lines.extend(
        [
            "",
            "## 说话人反查",
            "",
            "| 说话人 | 发言单元 | 身份 | 决策 | 分工 | 文档变更 | 行动 | 风险 |",
            "|---|---:|---:|---:|---:|---:|---:|---:|",
        ]
    )
    utterance_counts = Counter(item.speaker for item in utterances)
    for speaker in sorted(utterance_counts):
        counts = speaker_stats[speaker]
        values = " | ".join(str(counts[name]) for name in order)
        lines.append(f"| {speaker} | {utterance_counts[speaker]} | {values} |")

    for category in ["身份", "分工", "决策", "文档变更", "行动", "风险"]:
        lines.extend(["", f"## {category}候选", ""])
        if not candidates[category]:
            lines.append("- 未检出；仍需人工检查。")
            continue
        for item in candidates[category]:
            lines.append(
                f"- [{item.timestamp}] {item.speaker}：{shorten(item.text)}"
            )

    lines.extend(
        [
            "",
            "## 人工复核门禁",
            "",
            "- [ ] 每个时间窗均已回看原文，脚本零命中不等于无结论。",
            "- [ ] 已建立说话人身份表；用户明确确认优先于转写推断。",
            "- [ ] 每条“你跟谁做什么”等分工已拆成独立责任记录。",
            "- [ ] 最后 20% 的总结、撤回和重新分工已单独复核。",
            "- [ ] PRD、需求表、方案和看板的修改指令已进入下游变更账本。",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="按时间窗输出会议逐字稿的身份、分工、决策和文档变更候选。"
    )
    parser.add_argument("transcript", help="UTF-8 逐字稿路径；使用 - 从标准输入读取")
    parser.add_argument(
        "--window-minutes",
        type=int,
        default=10,
        help="时间窗口分钟数，默认 10",
    )
    args = parser.parse_args()
    if args.window_minutes <= 0:
        parser.error("--window-minutes 必须大于 0")

    try:
        text = read_input(args.transcript)
        utterances = parse_transcript(text)
        print(build_report(utterances, args.window_minutes))
    except (OSError, UnicodeError, ValueError) as exc:
        print(f"错误：{exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
