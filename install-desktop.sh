#!/usr/bin/env bash
# Creates a .desktop launcher on the current user's Desktop pointing at the packaged binary.
set -euo pipefail

# .desktop Exec/Path: escape spaces as \s (freedesktop.org spec).
_desktop_escape_spaces() {
  local s=$1
  echo "${s// /\\s}"
}

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN="$ROOT/bin/A3MissionLaunchpad"
WORKDIR="$ROOT/bin"

if [[ ! -f "$BIN" ]]; then
  echo "ERROR: Missing packaged app at $BIN. Build first: ./package.sh"
  exit 1
fi
chmod +x "$BIN" 2>/dev/null || true

DESKTOP="${XDG_DESKTOP_DIR:-}"
if [[ -z "$DESKTOP" ]] && command -v xdg-user-dir >/dev/null 2>&1; then
  DESKTOP="$(xdg-user-dir DESKTOP 2>/dev/null || true)"
fi
if [[ -z "$DESKTOP" ]] || [[ ! -d "$DESKTOP" ]]; then
  DESKTOP="$HOME/Desktop"
fi
if [[ ! -d "$DESKTOP" ]]; then
  echo "ERROR: Desktop folder not found (tried XDG_DESKTOP_DIR, xdg-user-dir, ~/Desktop)."
  exit 1
fi

OUT="$DESKTOP/a3-mission-launchpad.desktop"
EXEC_ESC="$(_desktop_escape_spaces "$BIN")"
PATH_ESC="$(_desktop_escape_spaces "$WORKDIR")"

{
  echo "[Desktop Entry]"
  echo "Version=1.0"
  echo "Type=Application"
  echo "Name=A3 Mission Launchpad"
  echo "Comment=Arma 3 mission launchpad"
  echo "Exec=$EXEC_ESC"
  echo "Path=$PATH_ESC"
  echo "Terminal=true"
  echo "Categories=Game;"
  if [[ -f "$ROOT/icon.png" ]]; then
    echo "Icon=$(_desktop_escape_spaces "$ROOT/icon.png")"
  fi
} >"$OUT"

chmod +x "$OUT"
echo "Wrote: $OUT"
