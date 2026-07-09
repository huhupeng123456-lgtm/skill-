#!/usr/bin/env python3
"""
Install dependencies and start the local dev server for a demo project.

Usage:
    python scripts/run_demo.py --demo-dir ./temp/load-balancer-demo
"""

import argparse
import subprocess
import sys
from pathlib import Path


def run_command(cmd: list[str], cwd: Path) -> None:
    """Run a command in the demo directory."""
    print(f"Running: {' '.join(cmd)}")
    try:
        subprocess.run(cmd, cwd=cwd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Command failed with exit code {e.returncode}", file=sys.stderr)
        sys.exit(e.returncode)
    except FileNotFoundError as e:
        print(f"Command not found: {e.filename}. Is Node.js installed?", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run a tech demo locally.")
    parser.add_argument("--demo-dir", required=True, help="Path to the demo project directory.")
    parser.add_argument("--no-install", action="store_true", help="Skip npm install.")

    args = parser.parse_args()
    demo_dir = Path(args.demo_dir).resolve()

    if not demo_dir.exists():
        print(f"Demo directory not found: {demo_dir}", file=sys.stderr)
        sys.exit(1)

    if not args.no_install:
        run_command(["npm", "install"], demo_dir)

    # Start dev server in the foreground.
    run_command(["npm", "run", "dev"], demo_dir)


if __name__ == "__main__":
    main()
