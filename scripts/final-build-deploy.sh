#!/usr/bin/env bash

# Βήμα 21: Τελικό production build και deploy στο Firebase

set -e

echo "🚦 Βήμα 21: Τελικό production build (npm run build)..."

if ! npm run build; then
  echo "❌ Production build failed. Διόρθωσε τα build errors και ξανατρέξε το script!"
  exit 1
fi
echo "✅ Build ΟΚ."

echo "🚦 Προεπισκόπηση (npm start)..."

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

echo "✅ Επιλέχθηκε το port $PORT για το final production preview."
npm start -- --port $PORT &
FINAL_PREVIEW_PID=$!
sleep 10

echo "🔍 Έλεγχος αν το production server ανταποκρίνεται (http://localhost:$PORT)..."

if timeout 30 curl --silent --fail http://localhost:$PORT >/dev/null; then
  echo "✅ Production preview ΟΚ!"
else
  echo "❌ Production server ΔΕΝ ανταποκρίνεται! Κάτι πήγε λάθος."
  kill $FINAL_PREVIEW_PID || true
  exit 1
fi

kill $FINAL_PREVIEW_PID || true
sleep 2

echo "🚦 Τελικό deploy στο Firebase..."

if ! firebase deploy; then
  echo "❌ Deploy failed! Διόρθωσε και ξαναπροσπάθησε."
  exit 1
fi
echo "✅ Deploy ΟΚ."
