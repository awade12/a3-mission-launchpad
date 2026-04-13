#!/usr/bin/env bash
# Linux/macOS packaging: same flow as package.bat (PyInstaller onedir under bin/).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
elif command -v python >/dev/null 2>&1; then
  PYTHON=python
else
  echo "ERROR: Neither python3 nor python found on PATH."
  exit 1
fi

if [[ ! -f launchpad_client/dist/index.html ]]; then
  echo "ERROR: Missing launchpad_client/dist. Run: (cd launchpad_client && npm run build)"
  exit 1
fi
if [[ ! -f launchpad_client/src/assets/hero.png ]]; then
  echo "ERROR: Missing launchpad_client/src/assets/hero.png (PNG splash for PyInstaller)"
  exit 1
fi
if [[ ! -f icon.png ]]; then
  echo "ERROR: Missing icon.png (converted to .ico during PyInstaller; Pillow required)"
  exit 1
fi
if ! "$PYTHON" -c "import PIL" 2>/dev/null; then
  echo "ERROR: Pillow is required. Run: pip install Pillow"
  exit 1
fi

# PyInstaller clears the whole bin output tree before COLLECT; avoid PermissionError if the app is still running.
echo "Stopping A3MissionLaunchpad if it is running..."
pkill -x A3MissionLaunchpad 2>/dev/null || pkill -f "/bin/A3MissionLaunchpad" 2>/dev/null || true
sleep 2

pyinstaller --noconfirm --distpath bin --workpath build launchpad.spec
