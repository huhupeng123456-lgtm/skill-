#!/usr/bin/env python3
"""
Scaffold a new tech demo project.

Usage:
    python scripts/create_demo.py --concept "负载均衡" --output-dir ./temp/load-balancer-demo
"""

import argparse
import shutil
import sys
from pathlib import Path


def get_skill_root() -> Path:
    """Return the directory where this skill is installed."""
    return Path(__file__).resolve().parent.parent


def copy_template(output_dir: Path) -> None:
    """Copy the React + Vite template to the output directory."""
    template_dir = get_skill_root() / "assets" / "templates" / "react-vite"
    if not template_dir.exists():
        print(f"Template not found: {template_dir}", file=sys.stderr)
        sys.exit(1)

    if output_dir.exists():
        shutil.rmtree(output_dir)

    shutil.copytree(template_dir, output_dir)


def replace_placeholders(output_dir: Path, concept: str, tagline: str, points: list[str]) -> None:
    """Replace placeholder tokens in the generated project."""
    app_path = output_dir / "src" / "App.jsx"
    text = app_path.read_text(encoding="utf-8")

    text = text.replace("{{CONCEPT_NAME}}", concept)
    text = text.replace("{{CONCEPT_TAGLINE}}", tagline)

    for i, point in enumerate(points, start=1):
        text = text.replace(f"{{{{EXPLAIN_POINT_{i}}}}}", point)

    # Remove unused placeholders so the file still parses.
    import re
    text = re.sub(r"\{\{EXPLAIN_POINT_\d+\}\}", "（待补充）", text)

    app_path.write_text(text, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a tech demo project.")
    parser.add_argument("--concept", required=True, help="Name of the technology concept.")
    parser.add_argument("--output-dir", required=True, help="Directory where the demo will be created.")
    parser.add_argument("--tagline", default="", help="One-line description of the concept.")
    parser.add_argument("--points", nargs="+", default=[], help="Explanation bullet points.")

    args = parser.parse_args()

    output_dir = Path(args.output_dir).resolve()
    copy_template(output_dir)
    replace_placeholders(output_dir, args.concept, args.tagline, args.points)

    print(f"Demo created at: {output_dir}")


if __name__ == "__main__":
    main()
