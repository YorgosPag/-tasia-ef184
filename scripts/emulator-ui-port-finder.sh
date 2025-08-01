#!/usr/bin/env bash

# Βήμα 9: Έξυπνη εύρεση ελεύθερης πόρτας για Firestore Emulator UI

set -e

FIREBASE_JSON="firebase.json"
BACKUP_FIREBASE_JSON="firebase.json.ui.bak"

find_free_port() {
  local start_port=$1
  local end_port=$2
  for ((port=start_port; port<=end_port; port++)); do
    if ! lsof -i :$port >/dev/null 2>&1; then
      echo $port
      return 0
    fi
  done
  return 1
}

START_PORT=4000
END_PORT=4010

PORT=$(find_free_port $START_PORT $END_PORT)
if [ -z "$PORT" ]; then
  echo "❌ Δεν βρέθηκε ελεύθερο port μεταξύ $START_PORT-$END_PORT για το Emulator UI!"
  exit 1
fi

echo "✅ Επιλέχθηκε το port $PORT για το Emulator UI."

# Backup του firebase.json
cp "$FIREBASE_JSON" "$BACKUP_FIREBASE_JSON"

# Ενημέρωση του firebase.json με τη νέα πόρτα για UI
jq --arg port "$PORT" '
  .emulators.ui.port = ($port | tonumber) |
  .emulators.ui.host = "127.0.0.1"
' "$BACKUP_FIREBASE_JSON" > "$FIREBASE_JSON"

echo "⚠️ ΜΗΝ ξεχάσεις να επαναφέρεις το αρχείο firebase.json μετά το τεστ αν χρειαστεί!"

# Για να επαναφέρεις:
# mv "$BACKUP_FIREBASE_JSON" "$FIREBASE_JSON"
