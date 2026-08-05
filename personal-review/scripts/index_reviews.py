#!/usr/bin/env python3
"""
index_reviews.py — 扫描复盘目录，建立索引

用法:
    python index_reviews.py [--dir <复盘目录>] [--output <索引文件>]

默认:
    复盘目录: D:/知识仓库/2P/复盘/
    索引文件: D:/知识仓库/2P/复盘/.review_index.json
"""

import os
import json
import re
import argparse
from pathlib import Path
from datetime import datetime

DEFAULT_REVIEW_DIR = r"D:\知识仓库\2P\复盘"
DEFAULT_INDEX_FILE = r"D:\知识仓库\2P\复盘\.review_index.json"


def extract_date_from_filename(filename):
    """从文件名提取日期，格式: YYYYMMDD_xxx.md"""
    match = re.match(r'(\d{8})_', filename)
    if match:
        return match.group(1)
    return None


def extract_tags(content):
    """从文件内容提取标签行: 标签：#工作 #决策"""
    for line in content.split('\n')[:10]:  # 只扫描前10行
        if line.startswith('标签：') or line.startswith('标签:'):
            tags = re.findall(r'#\w+', line)
            return tags
    return []


def extract_summary(content, max_len=100):
    """提取摘要：取第一个非标题、非标签的段落"""
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith('#') or line.startswith('标签'):
            continue
        if line.startswith('---'):
            continue
        return line[:max_len] + ('...' if len(line) > max_len else '')
    return ""


def extract_keywords(content):
    """提取核心关键词（简单实现：取高频实词）"""
    # 简单实现：取标题中的关键词
    for line in content.split('\n')[:5]:
        if line.startswith('# '):
            title = line[2:].strip()
            # 去掉日期前缀
            title = re.sub(r'^\d{8}\s*', '', title)
            return title[:20]
    return ""


def index_directory(review_dir, index_file):
    """扫描目录并建立索引"""
    review_dir = Path(review_dir)
    if not review_dir.exists():
        print(f"目录不存在: {review_dir}")
        return False

    index = {
        "generated_at": datetime.now().isoformat(),
        "total_reviews": 0,
        "tag_stats": {},
        "reviews": []
    }

    md_files = sorted(review_dir.glob("*.md"))

    for md_file in md_files:
        if md_file.name.startswith('.'):  # 跳过隐藏文件
            continue

        try:
            content = md_file.read_text(encoding='utf-8')
        except Exception as e:
            print(f"读取失败: {md_file.name} - {e}")
            continue

        date = extract_date_from_filename(md_file.name)
        tags = extract_tags(content)
        summary = extract_summary(content)
        keywords = extract_keywords(content)

        review_entry = {
            "filename": md_file.name,
            "date": date,
            "tags": tags,
            "keywords": keywords,
            "summary": summary,
            "path": str(md_file)
        }

        index["reviews"].append(review_entry)

        # 统计标签
        for tag in tags:
            index["tag_stats"][tag] = index["tag_stats"].get(tag, 0) + 1

    index["total_reviews"] = len(index["reviews"])

    # 写入索引文件
    index_path = Path(index_file)
    index_path.parent.mkdir(parents=True, exist_ok=True)

    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"索引完成: {index['total_reviews']} 篇复盘")
    print(f"标签统计: {index['tag_stats']}")
    print(f"索引文件: {index_file}")
    return True


def main():
    parser = argparse.ArgumentParser(description='复盘索引工具')
    parser.add_argument('--dir', default=DEFAULT_REVIEW_DIR, help='复盘目录')
    parser.add_argument('--output', default=DEFAULT_INDEX_FILE, help='索引文件输出路径')
    args = parser.parse_args()

    index_directory(args.dir, args.output)


if __name__ == '__main__':
    main()
