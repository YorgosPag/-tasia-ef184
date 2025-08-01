#!/usr/bin/env bash

# Αυτόματο git commit & push από Firebase Studio

set -e

echo "🚦 Git sync: Προσθήκη αλλαγών..."
git add .

MSG="Auto sync from Firebase Studio $(date '+%Y-%m-%d %H:%M')"
echo "🚦 Git sync: Commit με μήνυμα: $MSG"
git commit -m "$MSG" || echo "⚠️ Δεν υπάρχουν αλλαγές για commit."

echo "🚦 Git sync: Push στο origin main..."
git push origin main

echo "✅ Git sync ολοκληρώθηκε."
