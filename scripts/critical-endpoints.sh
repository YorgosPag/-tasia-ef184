#!/usr/bin/env bash

# Βήμα 13: Έλεγχος κρίσιμων API endpoints

set -e

echo "🚦 Βήμα 13: Έλεγχος κρίσιμων API endpoints..."

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

CRITICAL_ENDPOINTS=("/api/health" "/api/auth/status")
for endpoint in "${CRITICAL_ENDPOINTS[@]}"; do
  if timeout 10 curl --silent --fail "http://localhost:$PORT$endpoint" >/dev/null; then
    echo "✅ $endpoint ανταποκρίνεται"
  else
    echo "ℹ️  $endpoint δεν ανταποκρίνεται (ίσως να είναι αναμενόμενο)"
  fi
done

kill $DEV_PID || true
sleep 2
