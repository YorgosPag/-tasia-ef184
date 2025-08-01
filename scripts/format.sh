#!/usr/bin/env bash

# Βήμα 4 από 40: Έλεγχος και διόρθωση format (Prettier)

set -e

echo "🚦 Βήμα 4 από 40: Έλεγχος format (Prettier)..."

if [ -f package.json ] && grep -q "\"format\":" package.json; then
  if ! npm run format:check; then
    echo "⚠️  Formatting issues found. Auto-fixing..."
    npm run format || npx prettier --write .
    echo "✅ Formatting fixed automatically."
  else
    echo "✅ Formatting OK."
  fi
elif npx prettier --check . 2>/dev/null; then
  echo "✅ Formatting OK (prettier --check)."
else
  echo "⚠️  Formatting issues found. Auto-fixing..."
  npx prettier --write .
  echo "✅ Formatting fixed automatically."
fi
