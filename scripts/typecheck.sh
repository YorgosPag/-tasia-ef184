#!/usr/bin/env bash

# Βήμα 3 από 40: Έλεγχος TypeScript τύπων

set -e

echo "🚦 Βήμα 3 από 40: Έλεγχος TypeScript τύπων (npx tsc --noEmit)..."

if ! npx tsc --noEmit; then
  echo "❌ TypeScript type check failed. Διόρθωσε τα type errors πριν συνεχίσεις!"
  exit 1
fi

echo "✅ TypeScript types είναι έγκυροι."
