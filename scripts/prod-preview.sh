#!/usr/bin/env bash

# Βήμα 18: Εκκίνηση production preview server

set -e

echo "🚦 Βήμα 18: Εκκίνηση production preview server..."

START_PORT=9010
END_PORT=9020

find_free_port() {
  for port in $(seq $1 $2); do
    if ! lsof -i :$port >/dev/null 2>&1; then
      echo $port
      return 0
    fi
  done
  return 1
}

PORT=$(find_free_port $START_PORT $END_PORT)
if [ -z "$PORT" ]; then
  echo "❌ Δεν βρέθηκε ελεύθερο port μεταξύ $START_PORT-$END_PORT!"
  exit 1
fi

echo "✅ Επιλέχθηκε το port $PORT για το production preview."
npm start -- --port $PORT &
PREVIEW_PID=$!
sleep 10

echo "🔍 Έλεγχος αν ο production server ανταποκρίνεται στο http://localhost:$PORT..."

if timeout 30 curl --silent --fail http://localhost:$PORT >/dev/null; then
  echo "✅ Production server ανταποκρίνεται."
else
  echo "❌ Production server ΔΕΝ ανταποκρίνεται! Κάτι τρέχει..."
  kill $PREVIEW_PID || true
  exit 1
fi

echo "ℹ️  Άνοιξε το http://localhost:$PORT και δες το console για Firebase/Firestore errors."
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)."
read -p "↩️ "

kill $PREVIEW_PID || true
sleep 2
