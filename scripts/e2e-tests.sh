#!/usr/bin/env bash

# Βήμα 12: Τρέξιμο E2E tests

set -e

echo "🚦 Βήμα 12: Εκτέλεση E2E tests..."

if [ -f package.json ] && grep -q "\"e2e\":" package.json; then
  if ! npm run e2e; then
    echo "❌ E2E tests failed. Διόρθωσε τα σφάλματα!"
    exit 1
  fi
  echo "✅ E2E tests πέρασαν."
else
  echo "ℹ️  Δεν βρέθηκαν E2E tests, προχωράμε."
fi
