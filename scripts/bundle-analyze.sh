#!/usr/bin/env bash

# Βήμα 17: Bundle analysis

set -e

echo "🚦 Βήμα 17: Bundle analysis..."

if command -v npx >/dev/null 2>&1 && [ -d "dist/static/js" ]; then
  echo "ℹ️  Bundle analysis διαθέσιμο - εκτέλεσε χειροκίνητα αν χρειάζεται (π.χ. npx next-bundle-analyzer)."
else
  echo "ℹ️  Bundle analysis παραλείφθηκε."
fi
