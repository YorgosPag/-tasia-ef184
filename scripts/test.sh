#!/usr/bin/env bash

# Βήμα 20: Τρέξιμο unit & integration tests

set -e

echo "🚦 Βήμα 20: Εκτέλεση tests..."

if [ -f package.json ] && grep -q "\"test\":" package.json; then
  if ! npm test; then
    echo "❌ Tests failed. Κάτι δεν πάει καλά!"
    exit 1
  fi
  echo "✅ Tests πέρασαν."
else
  echo "ℹ️  Δεν βρέθηκαν tests, προχωράμε."
fi
