#!/usr/bin/env bash
find_free_port() {
  local start_port=$1
  local end_port=$2
  for ((port=$start_port; port<=$end_port; port++)); do
    if ! lsof -i :$port >/dev/null 2>&1; then
      echo $port
      return 0
    fi
  done
  return 1
}
PORT=$(find_free_port 9003 9010)
if [ -z "$PORT" ]; then
  echo "❌ Δεν βρέθηκε ελεύθερο port μεταξύ 9003-9010!" >&2
  exit 1
fi
echo $PORT
