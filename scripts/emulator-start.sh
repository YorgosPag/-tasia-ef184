#!/usr/bin/env bash

# Βήμα 8: Έξυπνη εκκίνηση Firestore emulator με ενημέρωση firebase.json

set -e

FIREBASE_JSON="firebase.json"
BACKUP_FIREBASE_JSON="firebase.json.bak"

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

START_PORT=8080
END_PORT=8090

PORT=$(find_free_port $START_PORT $END_PORT)
if [ -z "$PORT" ]; then
  echo "❌ Δεν βρέθηκε ελεύθερο port μεταξύ $START_PORT-$END_PORT!"
  exit 1
fi

echo "✅ Επιλέχθηκε το port $PORT για Firestore emulator."

# Backup του firebase.json
cp "$FIREBASE_JSON" "$BACKUP_FIREBASE_JSON"

# Ενημέρωση ή δημιουργία προσωρινού firebase.json με τη νέα πόρτα για Firestore emulator
jq --arg port "$PORT" '
  .emulators.firestore.port = ($port | tonumber) |
  .emulators.firestore.host = "127.0.0.1"
' "$BACKUP_FIREBASE_JSON" > "$FIREBASE_JSON"

# Εκκίνηση του emulator
firebase emulators:start --only firestore,functions --inspect-functions &>/tmp/emulator.log &
EMULATOR_PID=$!

sleep 15

if timeout 30 curl --silent --fail "http://localhost:$PORT" >/dev/null; then
  echo "✅ Firestore emulator ανταποκρίνεται στην πόρτα $PORT!"
else
  echo "❌ Firestore emulator δεν ανταποκρίνεται στην πόρτα $PORT!"
  kill $EMULATOR_PID || true
  # Επαναφορά του αρχικού firebase.json
  mv "$BACKUP_FIREBASE_JSON" "$FIREBASE_JSON"
  exit 1
fi

# Έλεγχος Firestore Emulator UI (συνήθως 4000)
if timeout 10 curl --silent --fail http://localhost:4000 >/dev/null; then
  echo "✅ Firestore Emulator UI διαθέσιμο στο http://localhost:4000"
else
  echo "⚠️  Firestore Emulator UI δεν είναι προσβάσιμο (πιθανόν απενεργοποιημένο)"
fi

# Τερματισμός emulator
kill $EMULATOR_PID || true
sleep 3

# Επαναφορά του αρχικού firebase.json
mv "$BACKUP_FIREBASE_JSON" "$FIREBASE_JSON"
