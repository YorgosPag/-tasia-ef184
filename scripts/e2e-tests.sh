#!/usr/bin/env bash

# Βήμα 12: Τρέξιμο E2E tests

set -e

echo "🚦 Βήμα 12: Εκτέλεση E2E tests..."

# Έλεγχος και εγκατάσταση Xvfb αν δεν υπάρχει
if ! command -v Xvfb >/dev/null 2>&1; then
  echo "ℹ️  Εγκατάσταση Xvfb..."
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    apt-get install -y xvfb
  elif command -v yum >/dev/null 2>&1; then
    yum install -y xorg-x11-server-Xvfb
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y xorg-x11-server-Xvfb
  elif command -v apk >/dev/null 2>&1; then
    apk add xvfb
  else
    echo "❌ Δεν βρέθηκε διαχειριστής πακέτων (apt-get, yum, dnf, apk). Εγκατέστησε το Xvfb χειροκίνητα."
    exit 1
  fi
fi

if [ -f package.json ] && grep -q "\"e2e\":" package.json; then
  echo "ℹ️  Εκκίνηση Xvfb..."
  Xvfb :99 -screen 0 1280x720x16 &
  export DISPLAY=:99
  if ! npm run e2e; then
    echo "❌ E2E tests failed. Διόρθωσε τα σφάλματα!"
    exit 1
  fi
  echo "✅ E2E tests πέρασαν."
else
  echo "ℹ️  Δεν βρέθηκαν E2E tests, προχωράμε."
fi

# Τερματισμός Xvfb
pkill Xvfb || true