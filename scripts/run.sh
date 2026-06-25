#!/usr/bin/env bash
#
# run.sh — One command to run UnifyFlow with or without the Firebase emulator.
#
#   ./scripts/run.sh              # emulator mode (default): emulators + seed + next dev
#   ./scripts/run.sh emulator     # same as above, explicit
#   ./scripts/run.sh live         # run against the real Firebase project in .env.local
#   ./scripts/run.sh emulator-only# just the emulators (+ seed), no Next dev server
#
# Emulator mode needs nothing but Node + this repo — the project id is
# `demo-unifyflow`, so no real Firebase account or credentials are required.
set -euo pipefail
cd "$(dirname "$0")/.."

MODE="${1:-emulator}"

echo "▶ Building Cloud Functions (so the emulator can load the triggers)…"
npm --prefix functions run build >/dev/null

case "$MODE" in
  live)
    echo "▶ LIVE mode — using the real Firebase project from .env.local"
    echo "  (make sure NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false and real config are set)"
    export NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
    exec npx next dev
    ;;
  emulator-only)
    echo "▶ EMULATOR — auth + firestore + functions (seed runs once on boot)"
    export NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
    exec npx firebase emulators:exec --only auth,firestore,functions --ui \
      "npx tsx scripts/seed.ts && echo '✅ Emulators running. Press Ctrl-C to stop.' && tail -f /dev/null"
    ;;
  emulator|"")
    echo "▶ EMULATOR mode — emulators + seed + Next dev (all in one)"
    export NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
    # emulators:exec keeps the emulators alive for as long as the wrapped
    # command runs; `next dev` runs until you Ctrl-C, then everything shuts down.
    exec npx firebase emulators:exec --only auth,firestore,functions --ui \
      "npx tsx scripts/seed.ts && npx next dev"
    ;;
  *)
    echo "Unknown mode: $MODE" >&2
    echo "Usage: ./scripts/run.sh [emulator|live|emulator-only]" >&2
    exit 1
    ;;
esac
