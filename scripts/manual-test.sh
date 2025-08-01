#!/usr/bin/env bash

# Βήμα 14: Manual testing στο browser

set -e

echo "🚦 Βήμα 14: Manual testing στο browser..."

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

npm run dev -- --port $PORT &
DEV_PID=$!
sleep 10

echo "ℹ️  Άνοιξε το http://localhost:$PORT στον browser."
echo "ℹ️  Δες τα Developer Tools για errors στο console."
echo "ℹ️  Κόκκινα errors = πρόβλημα, κίτρινα warnings = προσοχή."
echo "ℹ️  Πάτησε Enter όταν τελειώσεις το manual test (ή Ctrl+C για να το διακόψεις αν κάτι πάει στραβά)."
read -p "↩️ "

kill $DEV_PID || true
sleep 2
