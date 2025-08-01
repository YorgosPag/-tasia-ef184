#!/usr/bin/env bash

# Βήμα 11: Εκκίνηση development server και έλεγχος λειτουργίας

set -e

echo "🚦 Βήμα 11: Εκκίνηση development server..."

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

echo "✅ Επιλέχθηκε το port $PORT για το development server."

# Τρέχει το dev server με override της πόρτας μέσω περιβαλλοντικής μεταβλητής PORT
PORT=$PORT npm run dev
DEV_PID=$!
sleep 10

echo "🔍 Έλεγχος αν ο dev server απαντά στο http://localhost:$PORT..."

if timeout 30 curl --silent --fail http://localhost:$PORT >/dev/null; then
  echo "✅ Dev server ανταποκρίνεται."
else
  echo "❌ Dev server ΔΕΝ ανταποκρίνεται! Κάτι τρέχει..."
  kill $DEV_PID || true
  exit 1
fi

kill $DEV_PID || true
sleep 2
